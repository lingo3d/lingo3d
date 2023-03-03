import {
    CubeCamera,
    Group,
    HalfFloatType,
    Object3D,
    Texture,
    WebGLCubeRenderTarget
} from "three"
import fit from "./utils/fit"
import Loaded from "./core/Loaded"
import IModel, { modelDefaults, modelSchema } from "../interface/IModel"
import { Cancellable, Resolvable } from "@lincode/promiselikes"
import FoundManager from "./core/FoundManager"
import { Reactive } from "@lincode/reactivity"
import measure from "./utils/measure"
import { getExtensionIncludingObjectURL } from "./core/utils/objectURL"
import {
    decreaseLoadingCount,
    increaseLoadingCount
} from "../states/useLoadingCount"
import { forceGet } from "@lincode/utils"
import AnimationManager from "./core/AnimatedObjectManager/AnimationManager"
import throttleSystem from "../utils/throttleSystem"
import unsafeSetValue from "../utils/unsafeSetValue"
import { M2CM, NEAR } from "../globals"
import {
    pushReflectionPairs,
    pullReflectionPairs
} from "../states/useReflectionPairs"
import TextureManager from "./core/TextureManager"
import { uuidTextureMap } from "./core/mixins/utils/createMap"
import { StandardMesh } from "./core/mixins/TexturedStandardMixin"

const modelTextureManagersMap = new WeakMap<Model, Array<TextureManager>>()

const setFactor = (
    factor: number | undefined,
    textureManager: TextureManager,
    key: string
) =>
    unsafeSetValue(
        textureManager,
        key,
        factor === undefined
            ? textureManager.defaults[key]
            : Math.max(textureManager.defaults[key], 0.25) * factor
    )

const reflectionChangedSet = new WeakSet<Model>()
const reflectionDataMap = new WeakMap<Model, [Texture, Cancellable]>()
const supported = new Set(["fbx", "glb", "gltf"])

const refreshFactorsSystem = throttleSystem((model: Model) => {
    const {
        metalnessFactor,
        roughnessFactor,
        opacityFactor,
        envFactor,
        reflection
    } = model

    if (reflectionChangedSet.has(model)) {
        reflectionChangedSet.delete(model)

        reflectionDataMap.get(model)?.[1].cancel()
        reflectionDataMap.delete(model)

        if (reflection) {
            const reflectionHandle = new Cancellable()
            const cubeRenderTarget = new WebGLCubeRenderTarget(
                reflection ? 128 : 16
            )
            const { texture: reflectionTexture } = cubeRenderTarget
            reflectionTexture.type = HalfFloatType
            reflectionDataMap.set(model, [reflectionTexture, reflectionHandle])
            const cubeCamera = new CubeCamera(NEAR, 10, cubeRenderTarget)
            const pair: [Model, CubeCamera, WebGLCubeRenderTarget] = [
                model,
                cubeCamera,
                cubeRenderTarget
            ]
            pushReflectionPairs(pair)
            uuidTextureMap.set(reflectionTexture.uuid, reflectionTexture)

            reflectionHandle.then(() => {
                cubeRenderTarget.dispose()
                pullReflectionPairs(pair)
                uuidTextureMap.delete(reflectionTexture.uuid)
            })
        }
    }
    const textureManagers = forceGet(modelTextureManagersMap, model, () => {
        const result: Array<TextureManager> = []
        model.outerObject3d.traverse((child: Object3D | StandardMesh) => {
            if (!("material" in child)) return
            const { TextureManager } = child.material.userData
            TextureManager && result.push(new TextureManager(child, model))
        })
        return result
    })
    const reflectionTexture = reflectionDataMap.get(model)?.[0]
    for (const textureManager of textureManagers) {
        setFactor(metalnessFactor, textureManager, "metalness")
        setFactor(roughnessFactor, textureManager, "roughness")
        setFactor(opacityFactor, textureManager, "opacity")
        setFactor(envFactor, textureManager, "envMapIntensity")
        textureManager.envMap = reflectionTexture?.uuid
    }
})

export default class Model extends Loaded<Group> implements IModel {
    public static componentName = "model"
    public static defaults = modelDefaults
    public static schema = modelSchema

    public constructor(private unmounted?: boolean) {
        super(unmounted)
    }

    private loadingState = new Reactive(0)

    public override playAnimation(name?: string | number) {
        this.cancelHandle("modelPlayAnimation", () =>
            this.loadingState.get((count, handle) => {
                if (count) return
                handle.cancel()
                super.playAnimation(name)
            })
        )
    }

    public override stopAnimation() {
        this.cancelHandle("modelStopAnimation", () =>
            this.loadingState.get((count, handle) => {
                if (count) return
                handle.cancel()
                super.stopAnimation()
            })
        )
    }

    public serializeAnimations?: Record<string, string>
    public async loadAnimation(url: string, name = url) {
        ;(this.serializeAnimations ??= {})[name] = url

        const clip = (await this.load(url)).animations[0]
        if (!clip) return

        const { onFinishState, repeatState, finishEventState } =
            this.lazyStates()
        const animation = (this.animations[name] = new AnimationManager(
            name,
            clip,
            await this.loaded,
            repeatState,
            onFinishState,
            finishEventState
        ))
        this.append(animation)
    }

    public override get animations(): Record<string, AnimationManager> {
        return super.animations
    }
    public override set animations(
        val: Record<string, string | AnimationManager>
    ) {
        for (const [key, value] of Object.entries(val))
            if (typeof value === "string") this.loadAnimation(value, key)
            else this.animations[key] = value
    }

    protected async load(url: string) {
        increaseLoadingCount()
        const resolvable = new Resolvable()
        this.loadingState.set(this.loadingState.get() + 1)

        const extension = getExtensionIncludingObjectURL(url)
        if (!extension || !supported.has(extension)) {
            resolvable.resolve()
            setTimeout(() => this.loadingState.set(this.loadingState.get() - 1))
            decreaseLoadingCount()
            throw new Error("Unsupported file extension " + extension)
        }

        const module =
            extension === "fbx"
                ? await import("./utils/loaders/loadFBX")
                : await import("./utils/loaders/loadGLTF")

        let result: Group
        try {
            result = await module.default(url, !this.unmounted)
        } catch {
            resolvable.resolve()
            setTimeout(() => this.loadingState.set(this.loadingState.get() - 1))
            decreaseLoadingCount()
            throw new Error("Failed to load model, check if src is correct")
        }

        resolvable.resolve()
        setTimeout(() => this.loadingState.set(this.loadingState.get() - 1))
        decreaseLoadingCount()
        return result
    }

    private _resize?: boolean
    public get resize() {
        return this._resize ?? true
    }
    public set resize(val) {
        this._resize = val
        this.loaded.done && (this.src = this._src)
    }

    protected resolveLoaded(loadedObject3d: Group, src: string) {
        if (this.unmounted) return loadedObject3d

        const { onFinishState, repeatState, finishEventState } =
            this.lazyStates()
        for (const clip of loadedObject3d.animations) {
            const animation = (this.animations[clip.name] =
                new AnimationManager(
                    clip.name,
                    clip,
                    loadedObject3d,
                    repeatState,
                    onFinishState,
                    finishEventState
                ))
            this.append(animation)
        }
        const { x, y, z } =
            this._resize === false
                ? measure(loadedObject3d, src)
                : fit(loadedObject3d, src)

        this.runtimeDefaults = {
            width: x * M2CM,
            height: y * M2CM,
            depth: z * M2CM
        }
        !this.widthSet && (this.object3d.scale.x = x)
        !this.heightSet && (this.object3d.scale.y = y)
        !this.depthSet && (this.object3d.scale.z = z)

        return loadedObject3d
    }

    public override find(
        name: string,
        hiddenFromSceneGraph?: boolean
    ): FoundManager | undefined {
        const child = super.find(name, hiddenFromSceneGraph)
        child && (child.model = this)
        return child
    }

    public override findAll(
        name?: string | RegExp | ((name: string) => boolean)
    ): Array<FoundManager> {
        const children = super.findAll(name)
        for (const child of children) child.model = this

        return children
    }

    protected override _dispose() {
        super._dispose()
        reflectionDataMap.get(this)?.[1].cancel()
    }

    private refreshFactors() {
        this.cancelHandle("refreshFactors", () =>
            this.loaded.then(() => refreshFactorsSystem(this))
        )
    }

    private _metalnessFactor?: number
    public get metalnessFactor() {
        return this._metalnessFactor
    }
    public set metalnessFactor(val) {
        this._metalnessFactor = val
        this.refreshFactors()
    }

    private _roughnessFactor?: number
    public get roughnessFactor() {
        return this._roughnessFactor
    }
    public set roughnessFactor(val) {
        this._roughnessFactor = val
        this.refreshFactors()
    }

    private _opacityFactor?: number
    public get opacityFactor() {
        return this._opacityFactor
    }
    public set opacityFactor(val) {
        this._opacityFactor = val
        this.refreshFactors()
    }

    private _envFactor?: number
    public get envFactor() {
        return this._envFactor
    }
    public set envFactor(val) {
        this._envFactor = val
        this.refreshFactors()
    }

    private _reflection?: boolean
    public get reflection() {
        return this._reflection ?? false
    }
    public set reflection(val: boolean) {
        val !== this._reflection && reflectionChangedSet.add(this)
        this._reflection = val
        this.refreshFactors()
    }
}
