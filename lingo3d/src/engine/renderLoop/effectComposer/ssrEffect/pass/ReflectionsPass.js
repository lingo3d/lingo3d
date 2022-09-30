import { DepthPass, Pass, RenderPass } from "postprocessing"
import {
    HalfFloatType,
    LinearFilter,
    WebGLMultipleRenderTargets,
    WebGLRenderTarget
} from "three"
import isWebGL2 from "../../../../../api/utils/isWebGL2"
import { MRTMaterial } from "../material/MRTMaterial"
import { ReflectionsMaterial } from "../material/ReflectionsMaterial"
import { getVisibleChildren } from "../utils/Utils"

export class ReflectionsPass extends Pass {
    ssrEffect
    cachedMaterials = new WeakMap()
    USE_MRT = false
    webgl1DepthPass = null
    visibleMeshes = []

    constructor(ssrEffect, options = {}) {
        super("ReflectionsPass")

        this.ssrEffect = ssrEffect
        this._scene = ssrEffect._scene
        this._camera = ssrEffect._camera

        this.fullscreenMaterial = new ReflectionsMaterial()
        if (ssrEffect._camera.isPerspectiveCamera)
            this.fullscreenMaterial.defines.PERSPECTIVE_CAMERA = ""

        const width =
            options.width || typeof window !== "undefined"
                ? window.innerWidth
                : 2000
        const height =
            options.height || typeof window !== "undefined"
                ? window.innerHeight
                : 1000

        this.renderTarget = new WebGLRenderTarget(width, height, {
            minFilter: LinearFilter,
            magFilter: LinearFilter,
            type: HalfFloatType,
            depthBuffer: false
        })

        this.renderPass = new RenderPass(this._scene, this._camera)

        this.USE_MRT = isWebGL2

        if (this.USE_MRT) {
            // buffers: normal, depth (2), roughness will be written to the alpha channel of the normal buffer
            this.gBuffersRenderTarget = new WebGLMultipleRenderTargets(
                width,
                height,
                2,
                {
                    minFilter: LinearFilter,
                    magFilter: LinearFilter
                }
            )

            this.normalTexture = this.gBuffersRenderTarget.texture[0]
            this.depthTexture = this.gBuffersRenderTarget.texture[1]
        } else {
            // depth pass
            this.webgl1DepthPass = new DepthPass(this._scene, this._camera)
            this.webgl1DepthPass.renderTarget.minFilter = LinearFilter
            this.webgl1DepthPass.renderTarget.magFilter = LinearFilter

            this.webgl1DepthPass.renderTarget.texture.minFilter = LinearFilter
            this.webgl1DepthPass.renderTarget.texture.magFilter = LinearFilter

            this.webgl1DepthPass.setSize(
                typeof window !== "undefined" ? window.innerWidth : 2000,
                typeof window !== "undefined" ? window.innerHeight : 1000
            )

            // render normals (in the rgb channel) and roughness (in the alpha channel) in gBuffersRenderTarget
            this.gBuffersRenderTarget = new WebGLRenderTarget(width, height, {
                minFilter: LinearFilter,
                magFilter: LinearFilter
            })

            this.normalTexture = this.gBuffersRenderTarget.texture
            this.depthTexture = this.webgl1DepthPass.texture
        }

        // set up uniforms
        this.fullscreenMaterial.uniforms.normalTexture.value =
            this.normalTexture
        this.fullscreenMaterial.uniforms.depthTexture.value = this.depthTexture
        this.fullscreenMaterial.uniforms.accumulatedTexture.value =
            this.ssrEffect.temporalResolvePass.accumulatedTexture
        this.fullscreenMaterial.uniforms.cameraMatrixWorld.value =
            this._camera.matrixWorld
        this.fullscreenMaterial.uniforms._projectionMatrix.value =
            this._camera.projectionMatrix
        this.fullscreenMaterial.uniforms._inverseProjectionMatrix.value =
            this._camera.projectionMatrixInverse
    }

    setSize(width, height) {
        this.renderTarget.setSize(
            width * this.ssrEffect.resolutionScale,
            height * this.ssrEffect.resolutionScale
        )
        this.gBuffersRenderTarget.setSize(
            width * this.ssrEffect.resolutionScale,
            height * this.ssrEffect.resolutionScale
        )

        this.fullscreenMaterial.uniforms.accumulatedTexture.value =
            this.ssrEffect.temporalResolvePass.accumulatedTexture
        this.fullscreenMaterial.needsUpdate = true
    }

    dispose() {
        this.renderTarget.dispose()
        this.gBuffersRenderTarget.dispose()
        this.renderPass.dispose()
        if (!this.USE_MRT) this.webgl1DepthPass.dispose()

        this.fullscreenMaterial.dispose()

        this.normalTexture = null
        this.depthTexture = null
        this.velocityTexture = null
    }

    keepMaterialMapUpdated(mrtMaterial, originalMaterial, prop, define) {
        if (this.ssrEffect[define]) {
            if (originalMaterial[prop] !== mrtMaterial[prop]) {
                mrtMaterial[prop] = originalMaterial[prop]
                mrtMaterial.uniforms[prop].value = originalMaterial[prop]

                if (originalMaterial[prop]) {
                    mrtMaterial.defines[define] = ""
                } else {
                    delete mrtMaterial.defines[define]
                }

                mrtMaterial.needsUpdate = true
            }
        } else if (mrtMaterial[prop] !== undefined) {
            mrtMaterial[prop] = undefined
            mrtMaterial.uniforms[prop].value = undefined
            delete mrtMaterial.defines[define]
            mrtMaterial.needsUpdate = true
        }
    }

    setMRTMaterialInScene() {
        this.visibleMeshes = getVisibleChildren(this._scene)

        for (const c of this.visibleMeshes) {
            if (c.material) {
                const originalMaterial = c.material

                let [cachedOriginalMaterial, mrtMaterial] =
                    this.cachedMaterials.get(c) || []

                if (originalMaterial !== cachedOriginalMaterial) {
                    if (mrtMaterial) mrtMaterial.dispose()

                    mrtMaterial = new MRTMaterial()

                    if (this.USE_MRT) mrtMaterial.defines.USE_MRT = ""

                    mrtMaterial.normalScale = originalMaterial.normalScale
                    mrtMaterial.uniforms.normalScale.value =
                        originalMaterial.normalScale

                    const map =
                        originalMaterial.map ||
                        originalMaterial.normalMap ||
                        originalMaterial.roughnessMap ||
                        originalMaterial.metalnessMap

                    if (map) mrtMaterial.uniforms.uvTransform.value = map.matrix

                    this.cachedMaterials.set(c, [originalMaterial, mrtMaterial])
                }

                // update the child's MRT material

                this.keepMaterialMapUpdated(
                    mrtMaterial,
                    originalMaterial,
                    "normalMap",
                    "useNormalMap"
                )
                this.keepMaterialMapUpdated(
                    mrtMaterial,
                    originalMaterial,
                    "roughnessMap",
                    "useRoughnessMap"
                )

                mrtMaterial.uniforms.roughness.value =
                    this.ssrEffect.selection.size === 0 ||
                    this.ssrEffect.selection.has(c)
                        ? originalMaterial.roughness || 0
                        : 10e10

                c.material = mrtMaterial
            }
        }
    }

    unsetMRTMaterialInScene() {
        for (const c of this.visibleMeshes) {
            if (c.material?.type === "MRTMaterial") {
                c.visible = true
                // set material back to the original one
                const [originalMaterial] = this.cachedMaterials.get(c)

                c.material = originalMaterial
            }
        }
    }

    render(renderer, inputBuffer) {
        this.setMRTMaterialInScene()

        renderer.setRenderTarget(this.gBuffersRenderTarget)
        this.renderPass.render(renderer, this.gBuffersRenderTarget)

        this.unsetMRTMaterialInScene()

        // render depth and velocity in seperate passes
        if (!this.USE_MRT)
            this.webgl1DepthPass.renderPass.render(
                renderer,
                this.webgl1DepthPass.renderTarget
            )

        this.fullscreenMaterial.uniforms.inputTexture.value =
            inputBuffer.texture
        this.fullscreenMaterial.uniforms.samples.value =
            this.ssrEffect.temporalResolvePass.samples
        this.fullscreenMaterial.uniforms.cameraNear.value = this._camera.near
        this.fullscreenMaterial.uniforms.cameraFar.value = this._camera.far

        this.fullscreenMaterial.uniforms.viewMatrix.value.copy(
            this._camera.matrixWorldInverse
        )

        renderer.setRenderTarget(this.renderTarget)
        renderer.render(this.scene, this.camera)
    }
}
