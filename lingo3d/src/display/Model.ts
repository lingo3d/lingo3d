import { Group } from "three"
import fit from "./utils/fit"
import Loaded from "./core/Loaded"
import AnimationManager, {
    PlayOptions
} from "./core/AnimatedObjectManager/AnimationManager"
import { scaleDown } from "../engine/constants"
import IModel, { modelDefaults, modelSchema } from "../interface/IModel"
import { objectURLMapperPtr } from "./utils/loaders/setObjectURLMapper"
import { Resolvable } from "@lincode/promiselikes"
import { lazyLoadFBX, lazyLoadGLTF } from "./utils/loaders/lazyLoad"
import FoundManager from "./core/FoundManager"
import { Reactive } from "@lincode/reactivity"

export default class Model extends Loaded<Group> implements IModel {
    public static componentName = "model"
    public static defaults = modelDefaults
    public static schema = modelSchema

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

        let result: Group | undefined
        try {
            if (objectURLMapperPtr[0](url).toLowerCase().endsWith(".fbx"))
                result = await (await lazyLoadFBX()).default(url, true)
            else result = await (await lazyLoadGLTF()).default(url, true)
        } catch {
            resolvable.resolve()
            this.loadingState.set(this.loadingState.get() - 1)
            return new Group()
        }

        resolvable.resolve()
        this.loadingState.set(this.loadingState.get() - 1)

        return result
    }

    private _loadedScale?: number
    public get loadedScale() {
        return this._loadedScale
    }
    public set loadedScale(val) {
        this._loadedScale = val
    }

    private _loadedPos?: boolean
    private _loadedX?: number
    public get loadedX() {
        return this._loadedX
    }
    public set loadedX(val) {
        this._loadedX = val
        this._loadedPos = true
    }

    private _loadedY?: number
    public get loadedY() {
        return this._loadedY
    }
    public set loadedY(val) {
        this._loadedY = val
        this._loadedPos = true
    }

    private _loadedZ?: number
    public get loadedZ() {
        return this._loadedZ
    }
    public set loadedZ(val) {
        this._loadedZ = val
        this._loadedPos = true
    }

    protected resolveLoaded(loadedObject3d: Group) {
        for (const clip of loadedObject3d.animations)
            this.animations[clip.name] = this.watch(
                new AnimationManager(clip, loadedObject3d)
            )

        if (this._loadedScale)
            loadedObject3d.scale.multiplyScalar(this._loadedScale)
        else {
            const size = fit(loadedObject3d, this._src!)
            !this.widthSet && (this.object3d.scale.x = size.x)
            !this.heightSet && (this.object3d.scale.y = size.y)
            !this.depthSet && (this.object3d.scale.z = size.z)
        }

        if (this._loadedPos) {
            let { x, y, z } = loadedObject3d.position
            this._loadedX && (x = this._loadedX * scaleDown)
            this._loadedY && (y = this._loadedY * scaleDown)
            this._loadedZ && (z = this._loadedZ * scaleDown)
            loadedObject3d.position.set(x, y, z)
        }

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

    public override findAll(name?: string | RegExp): Array<FoundManager> {
        const children = super.findAll(name)
        for (const child of children) child.model = this

        return children
    }
}
