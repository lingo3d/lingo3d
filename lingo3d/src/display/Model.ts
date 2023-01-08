import { Group } from "three"
import fit from "./utils/fit"
import Loaded from "./core/Loaded"
import IModel, { modelDefaults, modelSchema } from "../interface/IModel"
import { Resolvable } from "@lincode/promiselikes"
import FoundManager from "./core/FoundManager"
import { Reactive } from "@lincode/reactivity"
import measure from "./utils/measure"
import { getExtensionIncludingObjectURL } from "./core/utils/objectURL"
import {
    decreaseLoadingCount,
    increaseLoadingCount
} from "../states/useLoadingCount"
import AdjustMaterialMixin from "./core/mixins/AdjustMaterialMixin"
import { applyMixins } from "@lincode/utils"
import AnimationManager from "./core/AnimatedObjectManager/AnimationManager"

class Model extends Loaded<Group> implements IModel {
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

    protected serializeAnimations?: Record<string, string>
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
        if (!extension || !["fbx", "glb", "gltf"].includes(extension)) {
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
        const measuredSize =
            this._resize === false
                ? measure(loadedObject3d, src)
                : fit(loadedObject3d, src)

        !this.widthSet && (this.object3d.scale.x = measuredSize.x)
        !this.heightSet && (this.object3d.scale.y = measuredSize.y)
        !this.depthSet && (this.object3d.scale.z = measuredSize.z)

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

    // protected refreshFactors() {
    //     this.cancelHandle("refreshFactorsLoaded", () => {
    //         const handle = this.loaded.then((loaded) =>
    //             queueMicrotask(() => {
    //                 if (handle.done) return
    //                 this._refreshFactors(
    //                     handle,
    //                     attachStandardMaterialManager(loaded, this, true)
    //                 )
    //             })
    //         )
    //         return handle
    //     })
    // }
}
//@ts-ignore
interface Model extends Loaded<Group>, AdjustMaterialMixin {}
applyMixins(Model, [AdjustMaterialMixin])
export default Model
