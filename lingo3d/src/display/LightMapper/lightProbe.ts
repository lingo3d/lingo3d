import * as THREE from "three"
import { BufferAttribute } from "three"

const tmpOrigin = new THREE.Vector3()
const tmpU = new THREE.Vector3()
const tmpV = new THREE.Vector3()

const tmpNormal = new THREE.Vector3()
const tmpLookAt = new THREE.Vector3()

const tmpProbeBox = new THREE.Vector4()
const tmpPrevClearColor = new THREE.Color()

// used inside blending function
const tmpNormalOther = new THREE.Vector3()

const PROBE_BG_ZERO = new THREE.Color("#000000")
const PROBE_BG_FULL = new THREE.Color("#ffffff")

export const PROBE_BATCH_COUNT = 8

export interface LightProbeSettings {
    targetSize: number
    offset: number
    near: number
    far: number
}

export const DEFAULT_LIGHT_PROBE_SETTINGS: LightProbeSettings = {
    targetSize: 16,
    offset: 0,
    near: 0.05,
    far: 50
}

export type ProbeDataReport = {
    rgbaData: Float32Array
    rowPixelStride: number
    probeBox: THREE.Vector4
    originX: number // device coordinates of lower-left corner of the viewbox
    originY: number
}

export interface ProbeTexel {
    texelIndex: number // used by caller for correlation
    originalMesh: THREE.Mesh
    originalBuffer: THREE.BufferGeometry
    faceIndex: number
    pU: number
    pV: number
}

export type ProbeBatcher = (
    gl: THREE.WebGLRenderer,
    lightScene: THREE.Scene,
    texelIterator: Iterator<ProbeTexel | null>
) => Generator<{
    texelIndex: number
    rgba: THREE.Vector4
}>

// bilinear interpolation of normals in triangle, with normalization
function setBlendedNormal(
    out: THREE.Vector3,
    origNormalArray: ArrayLike<number>,
    origIndexArray: ArrayLike<number>,
    faceVertexBase: number,
    pU: number,
    pV: number
) {
    // barycentric coordinate for origin point
    const pO = 1 - pU - pV

    out.fromArray(origNormalArray, origIndexArray[faceVertexBase] * 3)
    out.multiplyScalar(pO)

    tmpNormalOther.fromArray(
        origNormalArray,
        origIndexArray[faceVertexBase + 1] * 3
    )
    out.addScaledVector(tmpNormalOther, pU)

    tmpNormalOther.fromArray(
        origNormalArray,
        origIndexArray[faceVertexBase + 2] * 3
    )
    out.addScaledVector(tmpNormalOther, pV)

    out.normalize()
}

function setUpProbeUp(
    probeCam: THREE.Camera,
    mesh: THREE.Mesh,
    origin: THREE.Vector3,
    normal: THREE.Vector3,
    uDir: THREE.Vector3
) {
    probeCam.position.copy(origin)

    probeCam.up.copy(uDir)

    // add normal to accumulator and look at it
    tmpLookAt.copy(normal)
    tmpLookAt.add(origin)

    probeCam.lookAt(tmpLookAt)
    probeCam.scale.set(1, 1, 1)

    // then, transform camera into world space
    probeCam.applyMatrix4(mesh.matrixWorld)
}

function setUpProbeSide(
    probeCam: THREE.Camera,
    mesh: THREE.Mesh,
    origin: THREE.Vector3,
    normal: THREE.Vector3,
    direction: THREE.Vector3,
    directionSign: number
) {
    probeCam.position.copy(origin)

    // up is the normal
    probeCam.up.copy(normal)

    // add normal to accumulator and look at it
    tmpLookAt.copy(origin)
    tmpLookAt.addScaledVector(direction, directionSign)

    probeCam.lookAt(tmpLookAt)
    probeCam.scale.set(1, 1, 1)

    // then, transform camera into world space
    probeCam.applyMatrix4(mesh.matrixWorld)
}

// for each pixel in the individual probe viewport, compute contribution to final tally
// (edges are weaker because each pixel covers less of a view angle)
// @todo perform weighted pixel averaging/etc all in this file
export function generatePixelAreaLookup(probeTargetSize: number) {
    const probePixelCount = probeTargetSize * probeTargetSize
    const lookup = new Array(probePixelCount) as number[]

    const probePixelBias = 0.5 / probeTargetSize

    for (let py = 0; py < probeTargetSize; py += 1) {
        // compute offset from center (with a bias for target pixel size)
        const dy = py / probeTargetSize - 0.5 + probePixelBias

        for (let px = 0; px < probeTargetSize; px += 1) {
            // compute offset from center (with a bias for target pixel size)
            const dx = px / probeTargetSize - 0.5 + probePixelBias

            // compute multiplier as affected by inclination of corresponding ray
            const span = Math.hypot(dx * 2, dy * 2)
            const hypo = Math.hypot(span, 1)
            const area = 1 / hypo

            lookup[py * probeTargetSize + px] = area
        }
    }

    return lookup
}

// collect and combine pixel aggregate from rendered probe viewports
// (this ignores the alpha channel from viewports)
const tmpTexelRGBA = new THREE.Vector4()

function readTexel(
    readLightProbe: () => Generator<ProbeDataReport>,
    probePixelAreaLookup: number[]
) {
    let r = 0,
        g = 0,
        b = 0,
        totalDivider = 0

    for (const {
        rgbaData: probeData,
        rowPixelStride,
        probeBox: box,
        originX,
        originY
    } of readLightProbe()) {
        const probeTargetSize = box.z // assuming width is always full

        const rowStride = rowPixelStride * 4
        let rowStart = box.y * rowStride + box.x * 4
        const totalMax = (box.y + box.w) * rowStride
        let py = originY

        while (rowStart < totalMax) {
            const rowMax = rowStart + box.z * 4
            let px = originX

            for (let i = rowStart; i < rowMax; i += 4) {
                // compute multiplier as affected by inclination of corresponding ray
                const area = probePixelAreaLookup[py * probeTargetSize + px]

                r += area * probeData[i]
                g += area * probeData[i + 1]
                b += area * probeData[i + 2]

                totalDivider += area

                px += 1
            }

            rowStart += rowStride
            py += 1
        }
    }

    // alpha is set later
    tmpTexelRGBA.x = r / totalDivider
    tmpTexelRGBA.y = g / totalDivider
    tmpTexelRGBA.z = b / totalDivider
}

// @todo use light sphere for AO (double-check that far-extent is radius + epsilon)
export async function withLightProbe(
    aoMode: boolean,
    aoDistance: number,
    settings: LightProbeSettings,
    taskCallback: (
        renderLightProbeBatch: ProbeBatcher,
        debugLightProbeTexture: THREE.Texture
    ) => Promise<void>
) {
    const probeTargetSize = settings.targetSize
    const probeBgColor = aoMode ? PROBE_BG_FULL : PROBE_BG_ZERO

    const halfSize = probeTargetSize / 2

    const targetWidth = probeTargetSize * 4 // 4 tiles across
    const targetHeight = probeTargetSize * 2 * PROBE_BATCH_COUNT // 2 tiles x batch count

    // @todo make this async?
    const probePixelAreaLookup = generatePixelAreaLookup(probeTargetSize)

    // set up simple rasterization for pure data consumption
    const probeTarget = new THREE.WebGLRenderTarget(targetWidth, targetHeight, {
        type: THREE.FloatType,
        magFilter: THREE.NearestFilter,
        minFilter: THREE.NearestFilter,
        generateMipmaps: false
    })

    const rtFov = 90 // view cone must be quarter of the hemisphere
    const rtAspect = 1 // square render target
    const rtNear = settings.near
    const rtFar = aoMode ? aoDistance : settings.far // in AO mode, lock far-extent to requested distance
    const probeCam = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar)

    const probeData = new Float32Array(targetWidth * targetHeight * 4)

    const batchTexels = new Array(PROBE_BATCH_COUNT) as (number | undefined)[]

    // @todo ensure there is biasing to be in middle of texel physical square
    const renderLightProbeBatch: ProbeBatcher = function* renderLightProbeBatch(
        gl,
        lightScene,
        texelIterator
    ) {
        // save existing renderer state
        gl.getClearColor(tmpPrevClearColor)
        const prevClearAlpha = gl.getClearAlpha()
        const prevAutoClear = gl.autoClear
        const prevToneMapping = gl.toneMapping

        // reset tone mapping output to linear because we are aggregating unprocessed luminance output
        gl.toneMapping = THREE.LinearToneMapping

        // set up render target for overall clearing
        // (bypassing setViewport means that the renderer conveniently preserves previous state)
        probeTarget.scissorTest = true
        probeTarget.scissor.set(0, 0, targetWidth, targetHeight)
        probeTarget.viewport.set(0, 0, targetWidth, targetHeight)
        gl.setRenderTarget(probeTarget)
        gl.autoClear = false

        // clear entire area
        gl.setClearColor(probeBgColor, 1)
        gl.clear(true, true, false)

        for (let batchItem = 0; batchItem < PROBE_BATCH_COUNT; batchItem += 1) {
            const texelResult = texelIterator.next()

            if (!texelResult.done && texelResult.value) {
                const {
                    texelIndex,
                    originalMesh,
                    originalBuffer,
                    faceIndex,
                    pU,
                    pV
                } = texelResult.value

                // each batch is 2 tiles high
                const batchOffsetY = batchItem * probeTargetSize * 2

                // save which texel is being rendered for later reporting
                batchTexels[batchItem] = texelIndex

                if (!originalBuffer.index) {
                    throw new Error("expected indexed mesh")
                }

                // read vertex position for this face and interpolate along U and V axes
                const origIndexArray = originalBuffer.index.array
                const origPosArray = (
                    originalBuffer.attributes.position as BufferAttribute
                ).array
                const origNormalArray = (
                    originalBuffer.attributes.normal as BufferAttribute
                ).array

                // get face vertex positions
                const faceVertexBase = faceIndex * 3
                tmpOrigin.fromArray(
                    origPosArray,
                    origIndexArray[faceVertexBase] * 3
                )
                tmpU.fromArray(
                    origPosArray,
                    origIndexArray[faceVertexBase + 1] * 3
                )
                tmpV.fromArray(
                    origPosArray,
                    origIndexArray[faceVertexBase + 2] * 3
                )

                // compute face dimensions
                tmpU.sub(tmpOrigin)
                tmpV.sub(tmpOrigin)

                // set camera to match texel, first in mesh-local space
                tmpOrigin.addScaledVector(tmpU, pU)
                tmpOrigin.addScaledVector(tmpV, pV)

                // compute normal and cardinal directions
                // (done per texel for linear interpolation of normals)
                setBlendedNormal(
                    tmpNormal,
                    origNormalArray,
                    origIndexArray,
                    faceVertexBase,
                    pU,
                    pV
                )

                // use consistent "left" and "up" directions based on just the normal
                if (tmpNormal.x === 0 && tmpNormal.y === 0) {
                    tmpU.set(1, 0, 0)
                } else {
                    tmpU.set(0, 0, 1)
                }

                tmpV.crossVectors(tmpNormal, tmpU)
                tmpV.normalize()

                tmpU.crossVectors(tmpNormal, tmpV)
                tmpU.normalize()

                // nudge the light probe position based on requested offset
                tmpOrigin.addScaledVector(tmpNormal, settings.offset)

                // proceed with the renders
                setUpProbeUp(probeCam, originalMesh, tmpOrigin, tmpNormal, tmpU)
                probeTarget.viewport.set(
                    0,
                    batchOffsetY + probeTargetSize,
                    probeTargetSize,
                    probeTargetSize
                )
                probeTarget.scissor.set(
                    0,
                    batchOffsetY + probeTargetSize,
                    probeTargetSize,
                    probeTargetSize
                )
                gl.setRenderTarget(probeTarget) // propagate latest target params
                gl.render(lightScene, probeCam)

                // sides only need the upper half of rendered view, so we set scissor accordingly
                setUpProbeSide(
                    probeCam,
                    originalMesh,
                    tmpOrigin,
                    tmpNormal,
                    tmpU,
                    1
                )
                probeTarget.viewport.set(
                    0,
                    batchOffsetY,
                    probeTargetSize,
                    probeTargetSize
                )
                probeTarget.scissor.set(
                    0,
                    batchOffsetY + halfSize,
                    probeTargetSize,
                    halfSize
                )
                gl.setRenderTarget(probeTarget) // propagate latest target params
                gl.render(lightScene, probeCam)

                setUpProbeSide(
                    probeCam,
                    originalMesh,
                    tmpOrigin,
                    tmpNormal,
                    tmpU,
                    -1
                )
                probeTarget.viewport.set(
                    probeTargetSize,
                    batchOffsetY,
                    probeTargetSize,
                    probeTargetSize
                )
                probeTarget.scissor.set(
                    probeTargetSize,
                    batchOffsetY + halfSize,
                    probeTargetSize,
                    halfSize
                )
                gl.setRenderTarget(probeTarget) // propagate latest target params
                gl.render(lightScene, probeCam)

                setUpProbeSide(
                    probeCam,
                    originalMesh,
                    tmpOrigin,
                    tmpNormal,
                    tmpV,
                    1
                )
                probeTarget.viewport.set(
                    probeTargetSize * 2,
                    batchOffsetY,
                    probeTargetSize,
                    probeTargetSize
                )
                probeTarget.scissor.set(
                    probeTargetSize * 2,
                    batchOffsetY + halfSize,
                    probeTargetSize,
                    halfSize
                )
                gl.setRenderTarget(probeTarget) // propagate latest target params
                gl.render(lightScene, probeCam)

                setUpProbeSide(
                    probeCam,
                    originalMesh,
                    tmpOrigin,
                    tmpNormal,
                    tmpV,
                    -1
                )
                probeTarget.viewport.set(
                    probeTargetSize * 3,
                    batchOffsetY,
                    probeTargetSize,
                    probeTargetSize
                )
                probeTarget.scissor.set(
                    probeTargetSize * 3,
                    batchOffsetY + halfSize,
                    probeTargetSize,
                    halfSize
                )
                gl.setRenderTarget(probeTarget) // propagate latest target params
                gl.render(lightScene, probeCam)
            } else {
                // if nothing else to render, mark the end of batch and finish
                batchTexels[batchItem] = undefined
                break
            }
        }

        // fetch rendered data in one go (this is very slow)
        gl.readRenderTargetPixels(
            probeTarget,
            0,
            0,
            targetWidth,
            targetHeight,
            probeData
        )

        // restore renderer state
        gl.setRenderTarget(null) // this restores original scissor/viewport
        gl.setClearColor(tmpPrevClearColor, prevClearAlpha)
        gl.autoClear = prevAutoClear
        gl.toneMapping = prevToneMapping

        // if something was rendered, send off the data for consumption
        for (let batchItem = 0; batchItem < PROBE_BATCH_COUNT; batchItem += 1) {
            const renderedTexelIndex = batchTexels[batchItem]

            // see if the batch ended early
            if (renderedTexelIndex === undefined) {
                break
            }

            // each batch is 2 tiles high
            const probePartsReporter = function* () {
                const batchOffsetY = batchItem * probeTargetSize * 2
                const rowPixelStride = probeTargetSize * 4

                const probeDataReport: ProbeDataReport = {
                    rgbaData: probeData,
                    rowPixelStride,
                    probeBox: tmpProbeBox,
                    originX: 0, // filled in later
                    originY: 0
                }

                tmpProbeBox.set(
                    0,
                    batchOffsetY + probeTargetSize,
                    probeTargetSize,
                    probeTargetSize
                )
                probeDataReport.originX = 0
                probeDataReport.originY = 0
                yield probeDataReport

                tmpProbeBox.set(
                    0,
                    batchOffsetY + halfSize,
                    probeTargetSize,
                    halfSize
                )
                probeDataReport.originX = 0
                probeDataReport.originX = halfSize
                yield probeDataReport

                tmpProbeBox.set(
                    probeTargetSize,
                    batchOffsetY + halfSize,
                    probeTargetSize,
                    halfSize
                )
                probeDataReport.originX = 0
                probeDataReport.originX = halfSize
                yield probeDataReport

                tmpProbeBox.set(
                    probeTargetSize * 2,
                    batchOffsetY + halfSize,
                    probeTargetSize,
                    halfSize
                )
                probeDataReport.originX = 0
                probeDataReport.originX = halfSize
                yield probeDataReport

                tmpProbeBox.set(
                    probeTargetSize * 3,
                    batchOffsetY + halfSize,
                    probeTargetSize,
                    halfSize
                )
                probeDataReport.originX = 0
                probeDataReport.originX = halfSize
                yield probeDataReport
            }

            // aggregate the probe target pixels
            readTexel(probePartsReporter, probePixelAreaLookup)

            yield { texelIndex: renderedTexelIndex, rgba: tmpTexelRGBA }
        }
    }

    try {
        await taskCallback(renderLightProbeBatch, probeTarget.texture)
    } finally {
        // always clean up regardless of error state
        probeTarget.dispose()
    }
}
