import { Pass } from "postprocessing"
import {
    FramebufferTexture,
    HalfFloatType,
    LinearFilter,
    NearestFilter,
    RGBAFormat,
    Vector2,
    WebGLRenderTarget
} from "three"
import {
    positionChanged,
    quaternionChanged
} from "../../../../../../display/utils/trackObject"
import { TemporalResolveMaterial } from "../material/TemporalResolveMaterial"
import { VelocityPass } from "./VelocityPass"

const zeroVec2 = new Vector2()

// the following variables can be accessed by the custom compose shader:
// "inputTexel", "accumulatedTexel", "inputColor", "accumulatedColor", "alpha", "velocityDisocclusion", "didReproject", "boxBlurredColor" (if using box blur)
// the custom compose shader will write the final color to the variable "outputColor"

export class TemporalResolvePass extends Pass {
    velocityPass = null
    velocityResolutionScale = 1
    samples = 1

    constructor(scene, camera, customComposeShader, options = {}) {
        super("TemporalResolvePass")

        this._scene = scene
        this._camera = camera

        this.renderTarget = new WebGLRenderTarget(1, 1, {
            minFilter: LinearFilter,
            magFilter: LinearFilter,
            type: HalfFloatType,
            depthBuffer: false
        })

        this.velocityPass = new VelocityPass(scene, camera)

        this.fullscreenMaterial = new TemporalResolveMaterial(
            customComposeShader
        )

        this.fullscreenMaterial.defines.correctionRadius =
            options.correctionRadius || 1
        if (options.dilation) this.fullscreenMaterial.defines.dilation = ""
        if (options.boxBlur) this.fullscreenMaterial.defines.boxBlur = ""

        this.setupFramebuffers(1, 1)
        this.checkCanUseSharedVelocityTexture()
    }

    dispose() {
        if (
            this._scene.userData.velocityTexture ===
            this.velocityPass.renderTarget.texture
        ) {
            delete this._scene.userData.velocityTexture
            delete this._scene.userData.lastVelocityTexture
        }

        this.renderTarget.dispose()
        this.accumulatedTexture.dispose()
        this.fullscreenMaterial.dispose()
        this.velocityPass.dispose()
    }

    setSize(width, height) {
        this.renderTarget.setSize(width, height)
        this.velocityPass.setSize(
            width * this.velocityResolutionScale,
            height * this.velocityResolutionScale
        )

        this.velocityPass.renderTarget.texture.minFilter =
            this.velocityResolutionScale === 1 ? NearestFilter : LinearFilter
        this.velocityPass.renderTarget.texture.magFilter =
            this.velocityResolutionScale === 1 ? NearestFilter : LinearFilter
        this.velocityPass.renderTarget.texture.needsUpdate = true

        this.fullscreenMaterial.uniforms.invTexSize.value.set(
            1 / width,
            1 / height
        )
        this.setupFramebuffers(width, height)
    }

    setupFramebuffers(width, height) {
        if (this.accumulatedTexture) this.accumulatedTexture.dispose()
        if (this.lastVelocityTexture) this.lastVelocityTexture.dispose()

        this.accumulatedTexture = new FramebufferTexture(
            width,
            height,
            RGBAFormat
        )
        this.accumulatedTexture.minFilter = LinearFilter
        this.accumulatedTexture.magFilter = LinearFilter
        this.accumulatedTexture.type = HalfFloatType

        this.lastVelocityTexture = new FramebufferTexture(
            width * this.velocityResolutionScale,
            height * this.velocityResolutionScale,
            RGBAFormat
        )
        this.lastVelocityTexture.minFilter =
            this.velocityResolutionScale === 1 ? NearestFilter : LinearFilter
        this.lastVelocityTexture.magFilter =
            this.velocityResolutionScale === 1 ? NearestFilter : LinearFilter
        this.lastVelocityTexture.type = HalfFloatType

        this.fullscreenMaterial.uniforms.accumulatedTexture.value =
            this.accumulatedTexture
        this.fullscreenMaterial.uniforms.lastVelocityTexture.value =
            this.lastVelocityTexture

        this.fullscreenMaterial.needsUpdate = true
    }

    checkCanUseSharedVelocityTexture() {
        const canUseSharedVelocityTexture =
            this._scene.userData.velocityTexture &&
            this.velocityPass.renderTarget.texture !==
                this._scene.userData.velocityTexture

        if (canUseSharedVelocityTexture) {
            // let's use the shared one instead
            if (
                this.velocityPass.renderTarget.texture ===
                this.fullscreenMaterial.uniforms.velocityTexture.value
            ) {
                this.fullscreenMaterial.uniforms.lastVelocityTexture.value =
                    this._scene.userData.lastVelocityTexture
                this.fullscreenMaterial.uniforms.velocityTexture.value =
                    this._scene.userData.velocityTexture
                this.fullscreenMaterial.needsUpdate = true
            }
        } else {
            // let's stop using the shared one (if used) and mark ours as the shared one instead
            if (
                this.velocityPass.renderTarget.texture !==
                this.fullscreenMaterial.uniforms.velocityTexture.value
            ) {
                this.fullscreenMaterial.uniforms.velocityTexture.value =
                    this.velocityPass.renderTarget.texture
                this.fullscreenMaterial.uniforms.lastVelocityTexture.value =
                    this.lastVelocityTexture
                this.fullscreenMaterial.needsUpdate = true

                if (!this._scene.userData.velocityTexture) {
                    this._scene.userData.velocityTexture =
                        this.velocityPass.renderTarget.texture
                    this._scene.userData.lastVelocityTexture =
                        this.lastVelocityTexture
                }
            }
        }

        return (
            this.velocityPass.renderTarget.texture !==
            this.fullscreenMaterial.uniforms.velocityTexture.value
        )
    }

    checkNeedsResample() {
        if (positionChanged(this._camera) || quaternionChanged(this._camera))
            this.samples = 1
    }

    render(renderer) {
        this.samples++
        this.checkNeedsResample()
        this.fullscreenMaterial.uniforms.samples.value = this.samples

        // const isUsingSharedVelocityTexture = this.checkCanUseSharedVelocityTexture()
        // if (!isUsingSharedVelocityTexture) this.velocityPass.render(renderer)

        renderer.setRenderTarget(this.renderTarget)
        renderer.render(this.scene, this.camera)

        // save the render target's texture for use in next frame
        renderer.copyFramebufferToTexture(zeroVec2, this.accumulatedTexture)

        renderer.setRenderTarget(this.velocityPass.renderTarget)
        renderer.copyFramebufferToTexture(zeroVec2, this.lastVelocityTexture)
    }
}
