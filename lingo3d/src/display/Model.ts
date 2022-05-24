import { Group } from "three"
import fit from "./utils/fit"
import Loaded from "./core/Loaded"
import AnimationManager from "./core/SimpleObjectManager/AnimationManager"
import { scaleDown } from "../engine/constants"
import IModel, { modelDefaults, modelSchema } from "../interface/IModel"
import { objectURLMapperPtr } from "./utils/loaders/setObjectURLMapper"
import { Resolvable } from "@lincode/promiselikes"
import { lazyLoadFBX, lazyLoadGLTF } from "./utils/loaders/lazyLoad"
import FoundManager from "./core/FoundManager"

export default class Model extends Loaded<Group> implements IModel {
    public static componentName = "model"
    public static defaults = modelDefaults
    public static schema = modelSchema

    protected loadedAnims?: Record<string, string>

    public async loadAnimation(url: string, name = url) {
        (this.loadedAnims ??= {})[name] = url

        const resolvable = new Resolvable()
        ;(this.loadingAnims ??= []).push(resolvable)

        let data: Group | undefined

        try {
            data = await this.load(url)
        }
        catch {
            resolvable.resolve()
            return
        }

        const clip = data.animations[0]
        clip && (this.animations[name] = this.watch(new AnimationManager(clip, await this.loadedResolvable)))

        resolvable.resolve()
    }

    public override get animations(): Record<string, AnimationManager> {
        return this.animationManagers ??= {}
    }
    public override set animations(val: Record<string, string | AnimationManager>) {
        for (const [key, value] of Object.entries(val))
            if (typeof value === "string")
                this.loadAnimation(value, key)
            else
                this.animations[key] = value
    }

    protected async load(url: string) {
        const resolvable = new Resolvable()
        ;(this.loadingAnims ??= []).push(resolvable)

        let result: Group | undefined
        try {
            if (objectURLMapperPtr[0](url).toLowerCase().endsWith(".fbx"))
                result = await (await lazyLoadFBX()).default(url, true)
            else
                result = await (await lazyLoadGLTF()).default(url, true)
        }
        catch {
            resolvable.resolve()
            return new Group()
        }

        resolvable.resolve()
        return result
    }

    private _loadedScale?: number
    public get loadedScale() {
        return this._loadedScale
    }
    public set loadedScale(val: number | undefined) {
        this._loadedScale = val
    }

    private _loadedPos?: boolean
    private _loadedX?: number
    public get loadedX() {
        return this._loadedX
    }
    public set loadedX(val: number | undefined) {
        this._loadedX = val
        this._loadedPos = true
    }

    private _loadedY?: number
    public get loadedY() {
        return this._loadedY
    }
    public set loadedY(val: number | undefined) {
        this._loadedY = val
        this._loadedPos = true
    }

    private _loadedZ?: number
    public get loadedZ() {
        return this._loadedZ
    }
    public set loadedZ(val: number | undefined) {
        this._loadedZ = val
        this._loadedPos = true
    }

    protected resolveLoaded(loadedObject3d: Group) {
        for (const clip of loadedObject3d.animations)
            this.animations[clip.name] = this.watch(new AnimationManager(clip, loadedObject3d))

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
        
        this.loadedGroup.add(loadedObject3d)
        this.loadedResolvable.resolve(loadedObject3d)
    }

    public override find(name: string): FoundManager | undefined {
        const child = super.find(name)
        child && (child.model = this)
        return child
    }

    public override findAll(name: string): Array<FoundManager> {
        const children = super.findAll(name)
        for (const child of children)
            child.model = this

        return children
    }
}