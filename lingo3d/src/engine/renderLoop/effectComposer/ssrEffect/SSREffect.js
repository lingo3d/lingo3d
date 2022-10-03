import { Effect, Selection } from "postprocessing"
import {
    CubeCamera,
    LinearFilter,
    PMREMGenerator,
    ShaderChunk,
    Uniform,
    Vector3,
    WebGLCubeRenderTarget
} from "three"
import { emitAfterRenderSSR } from "../../../../events/onAfterRenderSSR"
import { emitBeforeRenderSSR } from "../../../../events/onBeforeRenderSSR"
import boxBlur from "./material/shader/boxBlur"
import finalSSRShader from "./material/shader/finalSSRShader"
import helperFunctions from "./material/shader/helperFunctions"
import trCompose from "./material/shader/trCompose"
import { ReflectionsPass } from "./pass/ReflectionsPass"
import { defaultSSROptions } from "./SSROptions"
import { TemporalResolvePass } from "./temporal-resolve/pass/TemporalResolvePass"
import { generateHalton23Points } from "./utils/generateHalton23Points"
import { useBoxProjectedEnvMap } from "./utils/useBoxProjectedEnvMap"
import { setupEnvMap } from "./utils/Utils"

const finalFragmentShader = finalSSRShader
    .replace("#include <helperFunctions>", helperFunctions)
    .replace("#include <boxBlur>", boxBlur)

// all the properties for which we don't have to resample
const noResetSamplesProperties = ["blur", "blurSharpness", "blurKernel"]

const defaultCubeRenderTarget = new WebGLCubeRenderTarget(1)
let pmremGenerator

export class SSREffect extends Effect {
    haltonSequence = generateHalton23Points(1024)
    haltonIndex = 0
    selection = new Selection()
    lastSize
    cubeCamera = new CubeCamera(0.001, 1000, defaultCubeRenderTarget)
    usingBoxProjectedEnvMap = false

    /**
     * @param {THREE.Scene} scene The scene of the SSR effect
     * @param {THREE.Camera} camera The camera with which SSR is being rendered
     * @param {SSROptions} [options] The optional options for the SSR effect
     */
    constructor(scene, camera, options = defaultSSROptions) {
        super("SSREffect", finalFragmentShader, {
            type: "FinalSSRMaterial",
            uniforms: new Map([
                ["reflectionsTexture", new Uniform(null)],
                ["blur", new Uniform(0)],
                ["blurSharpness", new Uniform(0)],
                ["blurKernel", new Uniform(0)]
            ]),
            defines: new Map([["RENDER_MODE", "0"]])
        })

        this._scene = scene
        this._camera = camera

        const trOptions = {
            boxBlur: true,
            dilation: true
        }

        options = { ...defaultSSROptions, ...options, ...trOptions }

        // set up passes

        // temporal resolve pass
        this.temporalResolvePass = new TemporalResolvePass(
            scene,
            camera,
            trCompose,
            options
        )

        this.uniforms.get("reflectionsTexture").value =
            this.temporalResolvePass.renderTarget.texture

        // reflections pass
        this.reflectionsPass = new ReflectionsPass(this, options)
        this.temporalResolvePass.fullscreenMaterial.uniforms.inputTexture.value =
            this.reflectionsPass.renderTarget.texture

        this.lastSize = {
            width: options.width,
            height: options.height,
            resolutionScale: options.resolutionScale,
            velocityResolutionScale: options.velocityResolutionScale
        }

        this.setSize(options.width, options.height)

        this.makeOptionsReactive(options)
    }

    makeOptionsReactive(options) {
        let needsUpdate = false

        const reflectionPassFullscreenMaterialUniforms =
            this.reflectionsPass.fullscreenMaterial.uniforms
        const reflectionPassFullscreenMaterialUniformsKeys = Object.keys(
            reflectionPassFullscreenMaterialUniforms
        )

        for (const key of Object.keys(options)) {
            Object.defineProperty(this, key, {
                get() {
                    return options[key]
                },
                set(value) {
                    if (options[key] === value && needsUpdate) return

                    options[key] = value

                    if (!noResetSamplesProperties.includes(key)) {
                        this.setSize(
                            this.lastSize.width,
                            this.lastSize.height,
                            true
                        )
                    }

                    switch (key) {
                        case "resolutionScale":
                            this.setSize(
                                this.lastSize.width,
                                this.lastSize.height
                            )
                            break

                        case "velocityResolutionScale":
                            this.temporalResolvePass.velocityResolutionScale =
                                value
                            this.setSize(
                                this.lastSize.width,
                                this.lastSize.height,
                                true
                            )
                            break

                        case "blur":
                            this.uniforms.get("blur").value = value
                            break

                        case "blurSharpness":
                            this.uniforms.get("blurSharpness").value = value
                            break

                        case "blurKernel":
                            this.uniforms.get("blurKernel").value = value
                            break

                        // defines
                        case "steps":
                            this.reflectionsPass.fullscreenMaterial.defines.steps =
                                parseInt(value)
                            this.reflectionsPass.fullscreenMaterial.needsUpdate =
                                needsUpdate
                            break

                        case "refineSteps":
                            this.reflectionsPass.fullscreenMaterial.defines.refineSteps =
                                parseInt(value)
                            this.reflectionsPass.fullscreenMaterial.needsUpdate =
                                needsUpdate
                            break

                        case "missedRays":
                            if (value) {
                                this.reflectionsPass.fullscreenMaterial.defines.missedRays =
                                    ""
                            } else {
                                delete this.reflectionsPass.fullscreenMaterial
                                    .defines.missedRays
                            }

                            this.reflectionsPass.fullscreenMaterial.needsUpdate =
                                needsUpdate
                            break

                        case "correctionRadius":
                            this.temporalResolvePass.fullscreenMaterial.defines.correctionRadius =
                                Math.round(value)

                            this.temporalResolvePass.fullscreenMaterial.needsUpdate =
                                needsUpdate
                            break

                        case "blend":
                            this.temporalResolvePass.fullscreenMaterial.uniforms.blend.value =
                                value
                            break

                        case "correction":
                            this.temporalResolvePass.fullscreenMaterial.uniforms.correction.value =
                                value
                            break

                        case "exponent":
                            this.temporalResolvePass.fullscreenMaterial.uniforms.exponent.value =
                                value
                            break

                        case "distance":
                            reflectionPassFullscreenMaterialUniforms.rayDistance.value =
                                value

                        // must be a uniform
                        default:
                            if (
                                reflectionPassFullscreenMaterialUniformsKeys.includes(
                                    key
                                )
                            ) {
                                reflectionPassFullscreenMaterialUniforms[
                                    key
                                ].value = value
                            }
                    }
                }
            })

            // apply all uniforms and defines
            this[key] = options[key]
        }

        needsUpdate = true
    }

    setSize(width, height, force = false) {
        if (
            !force &&
            width === this.lastSize.width &&
            height === this.lastSize.height &&
            this.resolutionScale === this.lastSize.resolutionScale &&
            this.velocityResolutionScale ===
                this.lastSize.velocityResolutionScale
        )
            return

        this.temporalResolvePass.setSize(width, height)
        this.reflectionsPass.setSize(width, height)

        this.lastSize = {
            width,
            height,
            resolutionScale: this.resolutionScale,
            velocityResolutionScale: this.velocityResolutionScale
        }
    }

    generateBoxProjectedEnvMapFallback(
        renderer,
        position = new Vector3(),
        size = new Vector3(),
        envMapSize = 512
    ) {
        this.cubeCamera.renderTarget.dispose()
        this.cubeCamera.renderTarget = new WebGLCubeRenderTarget(envMapSize)

        this.cubeCamera.position.copy(position)
        this.cubeCamera.updateMatrixWorld()
        this.cubeCamera.update(renderer, this._scene)

        if (!pmremGenerator) {
            pmremGenerator = new PMREMGenerator(renderer)
            pmremGenerator.compileCubemapShader()
        }
        const envMap = pmremGenerator.fromCubemap(
            this.cubeCamera.renderTarget.texture
        ).texture
        envMap.minFilter = LinearFilter
        envMap.magFilter = LinearFilter

        const reflectionsMaterial = this.reflectionsPass.fullscreenMaterial

        useBoxProjectedEnvMap(reflectionsMaterial, position, size)
        reflectionsMaterial.fragmentShader = reflectionsMaterial.fragmentShader
            .replace("vec3 worldPos", "worldPos")
            .replace("varying vec3 vWorldPosition;", "vec3 worldPos;")

        reflectionsMaterial.uniforms.envMapPosition.value.copy(position)
        reflectionsMaterial.uniforms.envMapSize.value.copy(size)

        setupEnvMap(reflectionsMaterial, envMap, envMapSize)

        this.usingBoxProjectedEnvMap = true

        return envMap
    }

    setIBLRadiance(iblRadiance, renderer) {
        this._scene.traverse((c) => {
            if (c.material) {
                const uniforms = renderer.properties.get(c.material)?.uniforms

                if (uniforms && "disableIBLRadiance" in uniforms) {
                    uniforms.disableIBLRadiance.value = iblRadiance
                }
            }
        })
    }

    deleteBoxProjectedEnvMapFallback() {
        const reflectionsMaterial = this.reflectionsPass.fullscreenMaterial
        reflectionsMaterial.uniforms.envMap.value = null
        reflectionsMaterial.fragmentShader =
            reflectionsMaterial.fragmentShader.replace(
                "worldPos = ",
                "vec3 worldPos = "
            )
        delete reflectionsMaterial.defines.BOX_PROJECTED_ENV_MAP

        reflectionsMaterial.needsUpdate = true

        this.usingBoxProjectedEnvMap = false
    }

    dispose() {
        super.dispose()

        this.reflectionsPass.dispose()
        this.temporalResolvePass.dispose()
    }

    update(renderer, inputBuffer) {
        emitBeforeRenderSSR()

        this.haltonIndex = (this.haltonIndex + 1) % this.haltonSequence.length

        const [x, y] = this.haltonSequence[this.haltonIndex]

        const { width, height } = this.lastSize

        this.temporalResolvePass.velocityPass.render(renderer)

        // jittering the view offset each frame reduces aliasing for the reflection
        if (this._camera.setViewOffset)
            this._camera.setViewOffset(width, height, x, y, width, height)

        // render reflections of current frame
        this.reflectionsPass.render(renderer, inputBuffer)

        // compose reflection of last and current frame into one reflection
        this.temporalResolvePass.render(renderer)

        this._camera.clearViewOffset()

        emitAfterRenderSSR()
    }

    static patchDirectEnvIntensity(envMapIntensity = 0) {
        if (envMapIntensity === 0) {
            ShaderChunk.envmap_physical_pars_fragment =
                ShaderChunk.envmap_physical_pars_fragment.replace(
                    "vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {",
                    "vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) { return vec3(0.0);"
                )
        } else {
            ShaderChunk.envmap_physical_pars_fragment =
                ShaderChunk.envmap_physical_pars_fragment.replace(
                    "vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );",
                    "vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness ) * " +
                        envMapIntensity.toFixed(5) +
                        ";"
                )
        }
    }
}
