import { Pass } from "postprocessing"
import { Color, HalfFloatType, VideoTexture, WebGLRenderTarget } from "three"
import { VelocityMaterial } from "../material/VelocityMaterial"
import { renderedOpaqueObjectsPtr } from "../../../../../../pointers/renderedOpaqueObjectsPtr"

const backgroundColor = new Color(0)
const updateProperties = ["visible", "wireframe", "side"]

export class VelocityPass extends Pass {
    cachedMaterials = new WeakMap()
    visibleMeshes = []
    renderedMeshesThisFrame = 0
    renderedMeshesLastFrame = 0

    constructor(scene, camera) {
        super("VelocityPass")

        this._scene = scene
        this._camera = camera

        this.renderTarget = new WebGLRenderTarget(
            window?.innerWidth || 1000,
            window?.innerHeight || 1000,
            {
                type: HalfFloatType
            }
        )
    }

    setVelocityMaterialInScene() {
        this.renderedMeshesThisFrame = 0

        this.visibleMeshes = renderedOpaqueObjectsPtr[0]

        for (const c of this.visibleMeshes) {
            const originalMaterial = c.material

            let [cachedOriginalMaterial, velocityMaterial] =
                this.cachedMaterials.get(c) || []

            if (originalMaterial !== cachedOriginalMaterial) {
                velocityMaterial = new VelocityMaterial()

                c.material = velocityMaterial

                this.cachedMaterials.set(c, [
                    originalMaterial,
                    velocityMaterial
                ])
            }

            velocityMaterial.uniforms.velocityMatrix.value.multiplyMatrices(
                this._camera.projectionMatrix,
                c.modelViewMatrix
            )

            if (
                c.userData.needsUpdatedReflections ||
                originalMaterial.map instanceof VideoTexture
            ) {
                if (!("FULL_MOVEMENT" in velocityMaterial.defines))
                    velocityMaterial.needsUpdate = true
                velocityMaterial.defines.FULL_MOVEMENT = ""
            } else {
                if ("FULL_MOVEMENT" in velocityMaterial.defines) {
                    delete velocityMaterial.defines.FULL_MOVEMENT
                    velocityMaterial.needsUpdate = true
                }
            }

            c.material = velocityMaterial

            if (!c.visible) continue

            this.renderedMeshesThisFrame++

            for (const prop of updateProperties)
                velocityMaterial[prop] = originalMaterial[prop]
        }
    }

    unsetVelocityMaterialInScene() {
        for (const c of this.visibleMeshes) {
            if (c.material.isVelocityMaterial) {
                c.material.uniforms.prevVelocityMatrix.value.multiplyMatrices(
                    this._camera.projectionMatrix,
                    c.modelViewMatrix
                )

                c.material = this.cachedMaterials.get(c)[0]
            }
        }
    }

    setSize(width, height) {
        this.renderTarget.setSize(width, height)
    }

    renderVelocity(renderer) {
        renderer.setRenderTarget(this.renderTarget)

        if (this.renderedMeshesThisFrame > 0) {
            const { background } = this._scene

            this._scene.background = backgroundColor

            renderer.render(this._scene, this._camera)

            this._scene.background = background
        } else {
            renderer.clearColor()
        }
    }

    render(renderer) {
        this.setVelocityMaterialInScene()

        if (
            this.renderedMeshesThisFrame > 0 ||
            this.renderedMeshesLastFrame > 0
        )
            this.renderVelocity(renderer)

        this.unsetVelocityMaterialInScene()

        this.renderedMeshesLastFrame = this.renderedMeshesThisFrame
    }
}
