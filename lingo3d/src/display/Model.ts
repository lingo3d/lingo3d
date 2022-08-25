import { Group } from "three"
import fit from "./utils/fit"
import Loaded from "./core/Loaded"
import AnimationManager, {
    PlayOptions
} from "./core/AnimatedObjectManager/AnimationManager"
import IModel, { modelDefaults, modelSchema } from "../interface/IModel"
import { Resolvable } from "@lincode/promiselikes"
import { lazyLoadFBX, lazyLoadGLTF } from "./utils/loaders/lazyLoad"
import FoundManager from "./core/FoundManager"
import { Reactive } from "@lincode/reactivity"
import measure from "./utils/measure"
import { splitFileName } from "@lincode/utils"

export default class Model extends Loaded<Group> implements IModel {
    public static componentName = "model"
    public static defaults = modelDefaults
    public static schema = modelSchema

    public constructor(private unmounted?: boolean) {
        super(unmounted)
    }

    private loadingState = new Reactive(0)

    public override playAnimation(name?: string | number, o?: PlayOptions) {
        setTimeout(() =>
            this.cancelHandle("playAnimation", () =>
                this.loadingState.get((count, handle) => {
                    if (count) return
                    handle.cancel()
                    super.playAnimation(name, o)
                })
            )
        )
    }

    public override stopAnimation() {
        setTimeout(() =>
            this.cancelHandle("stopAnimation", () =>
                this.loadingState.get((count, handle) => {
                    if (count) return
                    handle.cancel()
                    super.stopAnimation()
                })
            )
        )
    }

    protected serializeAnimations?: Record<string, string>

    public async loadAnimation(url: string, name = url) {
        ;(this.serializeAnimations ??= {})[name] = url

        const clip = (await this.load(url)).animations[0]
        if (!clip) return

        this.animations[name] = this.watch(
            new AnimationManager(clip, await this.loaded)
        )
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
        const resolvable = new Resolvable()
        this.loadingState.set(this.loadingState.get() + 1)

        const extension = splitFileName(url)[1]?.toLowerCase()
        if (!extension || !["fbx", "glb", "gltf"].includes(extension)) {
            resolvable.resolve()
            setTimeout(() => this.loadingState.set(this.loadingState.get() - 1))
            return new Group()
        }

        let result: Group
        try {
            result =
                extension === "fbx"
                    ? await (await lazyLoadFBX()).default(url, !this.unmounted)
                    : await (await lazyLoadGLTF()).default(url, !this.unmounted)
        } catch {
            resolvable.resolve()
            setTimeout(() => this.loadingState.set(this.loadingState.get() - 1))
            return new Group()
        }

        resolvable.resolve()
        setTimeout(() => this.loadingState.set(this.loadingState.get() - 1))
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
        for (const clip of loadedObject3d.animations)
            this.animations[clip.name] = this.watch(
                new AnimationManager(clip, loadedObject3d)
            )

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
}
