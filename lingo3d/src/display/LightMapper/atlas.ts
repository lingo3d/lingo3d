import * as THREE from "three"

import { ProbeTexel } from "./lightProbe"

export interface AtlasMapItem {
    faceCount: number
    originalMesh: THREE.Mesh
    originalBuffer: THREE.BufferGeometry
}

interface AtlasMapInternalItem extends AtlasMapItem {
    perFaceBuffer: THREE.BufferGeometry
}

export interface AtlasMap {
    width: number
    height: number
    items: AtlasMapItem[]
    data: Float32Array
}

// must be black for full zeroing
const ATLAS_BG_COLOR = new THREE.Color("#000000")

const VERTEX_SHADER = `
  attribute vec4 faceInfo;
  attribute vec2 uv2;

  varying vec4 vFaceInfo;
  uniform vec2 uvOffset;

  void main() {
    vFaceInfo = faceInfo;

    gl_Position = projectionMatrix * vec4(
      uv2 + uvOffset, // UV2 is the actual position on map
      0,
      1.0
    );
  }
`

const FRAGMENT_SHADER = `
  varying vec4 vFaceInfo;

  void main() {
    // encode the face information in map
    gl_FragColor = vFaceInfo;
  }
`

function getTexelInfo(
    atlasMap: AtlasMap,
    texelIndex: number
): ProbeTexel | null {
    // get current atlas face we are filling up
    const texelInfoBase = texelIndex * 4
    const texelPosU = atlasMap.data[texelInfoBase]
    const texelPosV = atlasMap.data[texelInfoBase + 1]
    const texelItemEnc = atlasMap.data[texelInfoBase + 2]
    const texelFaceEnc = atlasMap.data[texelInfoBase + 3]

    // skip computation if this texel is empty
    if (texelItemEnc === 0) {
        return null
    }

    // otherwise, proceed with computation and exit
    const texelItemIndex = Math.round(texelItemEnc - 1)
    const texelFaceIndex = Math.round(texelFaceEnc - 1)

    if (texelItemIndex < 0 || texelItemIndex >= atlasMap.items.length) {
        throw new Error(
            `incorrect atlas map item data: ${texelPosU}, ${texelPosV}, ${texelItemEnc}, ${texelFaceEnc}`
        )
    }

    const atlasItem = atlasMap.items[texelItemIndex]

    if (texelFaceIndex < 0 || texelFaceIndex >= atlasItem.faceCount) {
        throw new Error(
            `incorrect atlas map face data: ${texelPosU}, ${texelPosV}, ${texelItemEnc}, ${texelFaceEnc}`
        )
    }

    // report the viable texel to be baked
    // @todo reduce malloc?
    return {
        texelIndex,
        originalMesh: atlasItem.originalMesh,
        originalBuffer: atlasItem.originalBuffer,
        faceIndex: texelFaceIndex,
        pU: texelPosU,
        pV: texelPosV
    }
}

// iterate through all texels
export function* scanAtlasTexels(atlasMap: AtlasMap, onFinished: () => void) {
    const { width: atlasWidth, height: atlasHeight } = atlasMap
    const totalTexelCount = atlasWidth * atlasHeight

    let texelCount = 0

    let retryCount = 0
    while (texelCount < totalTexelCount) {
        // get current texel info and increment
        const currentCounter = texelCount
        texelCount += 1

        const texelInfo = getTexelInfo(atlasMap, currentCounter)

        // try to keep looking for a reasonable number of cycles
        // before yielding empty result
        if (!texelInfo && retryCount < 100) {
            retryCount += 1
            continue
        }

        // yield out with either a found texel or nothing
        retryCount = 0
        yield texelInfo
    }

    onFinished()
}

// write out original face geometry info into the atlas map
// each texel corresponds to: (quadX, quadY, quadIndex)
// where quadX and quadY are 0..1 representing a spot in the original quad
// and quadIndex is 1-based to distinguish from blank space
// which allows to find original 3D position/normal/etc for that texel
// (quad index is int stored as float, but precision should be good enough)
// NOTE: each atlas texture sample corresponds to the position of
// the physical midpoint of the corresponding rendered texel
// (e.g. if lightmap was shown pixelated); this works well
// with either bilinear or nearest filtering
// @todo consider stencil buffer, or just 8bit texture

function getInputItems(sceneItems: Generator<THREE.Object3D, void, unknown>) {
    const items = [] as AtlasMapInternalItem[]

    for (const mesh of sceneItems) {
        if (!(mesh instanceof THREE.Mesh)) {
            continue
        }

        // ignore anything that is not a buffer geometry
        // @todo warn on legacy geometry objects if they seem to have UV2?
        const buffer = mesh.geometry
        if (!(buffer instanceof THREE.BufferGeometry)) {
            continue
        }

        // if we see this object, it is not read-only and hence must have UV2
        const uv2Attr = buffer.attributes.uv2
        if (!uv2Attr) {
            throw new Error(
                "expecting UV2 coordinates on writable lightmapped mesh"
            )
        }

        // gather other necessary attributes and ensure compatible data
        // @todo support non-indexed meshes
        // @todo support interleaved attributes
        const indexAttr = buffer.index
        if (!indexAttr) {
            throw new Error("expected face index array")
        }

        const faceVertexCount = indexAttr.array.length

        if (!(uv2Attr instanceof THREE.BufferAttribute)) {
            throw new Error("expected uv2 attribute")
        }

        // index of this item once it will be added to list
        const itemIndex = items.length

        const atlasPosAttr = new THREE.Float32BufferAttribute(
            faceVertexCount * 3,
            3
        )
        const atlasUV2Attr = new THREE.Float32BufferAttribute(
            faceVertexCount * 2,
            2
        )
        const atlasFaceInfoAttr = new THREE.Float32BufferAttribute(
            faceVertexCount * 4,
            4
        )

        // unroll indexed mesh data into non-indexed buffer so that we can encode per-face data
        // (otherwise vertices may be shared, and hence cannot have face-specific info in vertex attribute)
        const indexData = indexAttr.array
        for (
            let faceVertexIndex = 0;
            faceVertexIndex < faceVertexCount;
            faceVertexIndex += 1
        ) {
            const faceMod = faceVertexIndex % 3

            // not bothering to copy vertex position data because we don't need it
            // (however, we cannot omit the 'position' attribute altogether)
            atlasUV2Attr.copyAt(
                faceVertexIndex,
                uv2Attr,
                indexData[faceVertexIndex]
            )

            // position of vertex in face: (0,0), (0,1) or (1,0)
            const facePosX = faceMod & 1
            const facePosY = (faceMod & 2) >> 1

            // mesh index + face index combined into one
            const faceIndex = (faceVertexIndex - faceMod) / 3

            atlasFaceInfoAttr.setXYZW(
                faceVertexIndex,
                facePosX,
                facePosY,
                itemIndex + 1, // encode item index (1-based to indicate filled texels)
                faceIndex + 1 // encode face index (1-based to indicate filled texels)
            )
        }

        // this buffer is disposed of when atlas scene is unmounted
        const atlasBuffer = new THREE.BufferGeometry()
        atlasBuffer.setAttribute("position", atlasPosAttr)
        atlasBuffer.setAttribute("uv2", atlasUV2Attr)
        atlasBuffer.setAttribute("faceInfo", atlasFaceInfoAttr)

        items.push({
            faceCount: faceVertexCount / 3,
            perFaceBuffer: atlasBuffer,
            originalMesh: mesh,
            originalBuffer: buffer
        })
    }

    return items
}

function createOrthoScene(inputItems: AtlasMapInternalItem[]) {
    const orthoScene = new THREE.Scene()
    orthoScene.name = "Atlas mapper ortho scene"

    for (const geom of inputItems) {
        const mesh = new THREE.Mesh()
        mesh.frustumCulled = false // skip bounding box checks (not applicable and logic gets confused)

        mesh.geometry = geom.perFaceBuffer
        mesh.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,

            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER
        })

        orthoScene.add(mesh)
    }

    return orthoScene
}

export function renderAtlas(
    gl: THREE.WebGLRenderer,
    width: number,
    height: number,
    sceneItems: Generator<THREE.Object3D, void, unknown>
) {
    const inputItems = getInputItems(sceneItems)
    const orthoScene = createOrthoScene(inputItems)

    // set up simple rasterization for pure data consumption
    const orthoTarget = new THREE.WebGLRenderTarget(width, height, {
        type: THREE.FloatType,
        magFilter: THREE.NearestFilter,
        minFilter: THREE.NearestFilter,
        depthBuffer: false,
        generateMipmaps: false
    })

    const orthoCamera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 1)
    const orthoData = new Float32Array(width * height * 4)

    // save existing renderer state
    const prevClearColor = new THREE.Color()
    gl.getClearColor(prevClearColor)
    const prevClearAlpha = gl.getClearAlpha()
    const prevAutoClear = gl.autoClear

    // produce the output
    gl.setRenderTarget(orthoTarget)

    gl.setClearColor(ATLAS_BG_COLOR, 0) // alpha must be zero
    gl.autoClear = true

    gl.render(orthoScene, orthoCamera)

    // restore previous renderer state
    gl.setRenderTarget(null)
    gl.setClearColor(prevClearColor, prevClearAlpha)
    gl.autoClear = prevAutoClear

    gl.readRenderTargetPixels(orthoTarget, 0, 0, width, height, orthoData)

    // clean up
    orthoTarget.dispose()

    return {
        width: width,
        height: height,
        data: orthoData,

        // no need to expose references to atlas-specific geometry clones
        items: inputItems.map(
            ({ faceCount, originalMesh, originalBuffer }) => ({
                faceCount,
                originalMesh,
                originalBuffer
            })
        )
    }
}
