import { Group, Object3D, PropertyBinding } from "three"
import fit from "./utils/fit"
import Loaded from "./core/Loaded"
import IModel, { modelDefaults, modelSchema } from "../interface/IModel"
import FoundManager from "./core/FoundManager"
import AnimationManager from "./core/AnimatedObjectManager/AnimationManager"
import { M2CM } from "../globals"
import { addRefreshFactorsSystem } from "../systems/configLoadedSystems/refreshFactorsSystem"
import {
    reflectionDataMap,
    reflectionChangedSet
} from "../collections/reflectionCollections"
import { measure } from "../utilsCached/measure"
import { indexChildrenNames } from "../utilsCached/indexChildrenNames"
import { getFoundManager } from "../api/utils/getFoundManager"
import { indexMeshChildrenNames } from "../utilsCached/indexMeshChildrenNames"
import findFirst from "../utilsCached/findFirst"
import findFirstMesh from "../utilsCached/findFirstMesh"
import findAll from "../utilsCached/findAll"
import findAllMeshes from "../utilsCached/findAllMeshes"
import loadModel from "./utils/loaders/loadModel"
import getAnimationStates from "../utilsCached/getAnimationStates"

export default class Model extends Loaded<Group> implements IModel {
    public static componentName = "model"
    public static defaults = modelDefaults
    public static schema = modelSchema

    public $loadingCount = 0

    public serializeAnimations?: Record<string, string>
    public async loadAnimation(url: string, name = url) {
        ;(this.serializeAnimations ??= {})[name] = url

        const clip = (await this.$load(url)).animations[0]
        if (!clip) return

        const animation = (this.animations[name] = new AnimationManager(
            name,
            clip,
            await new Promise<Object3D>((resolve) =>
                this.events.once("loaded", resolve)
            ),
            getAnimationStates(this)
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
            else super.animations[key] = value
    }

    public async $load(url: string) {
        this.$loadingCount += 1
        try {
            const result = await loadModel(url, true)
            this.$loadingCount -= 1
            return result
        } catch (err) {
            this.$loadingCount -= 1
            throw err
        }
    }

    private _resize?: boolean
    public get resize() {
        return this._resize ?? true
    }
    public set resize(val) {
        this._resize = val
        this.$loadedObject3d && (this.src = this._src)
    }

    public $resolveLoaded(loadedObject3d: Group, src: string) {
        if (loadedObject3d.animations.length) {
            for (const clip of loadedObject3d.animations) {
                const animation = (this.animations[clip.name] =
                    new AnimationManager(
                        clip.name,
                        clip,
                        loadedObject3d,
                        getAnimationStates(this)
                    ))
                this.append(animation)
            }
        }
        const [{ x, y, z }] =
            this._resize === false
                ? measure(src, { target: loadedObject3d })
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

    protected override disposeNode() {
        super.disposeNode()
        reflectionDataMap.get(this)?.[1].cancel()
    }

    private _metalnessFactor?: number
    public get metalnessFactor() {
        return this._metalnessFactor
    }
    public set metalnessFactor(val) {
        this._metalnessFactor = val
        addRefreshFactorsSystem(this)
    }

    private _roughnessFactor?: number
    public get roughnessFactor() {
        return this._roughnessFactor
    }
    public set roughnessFactor(val) {
        this._roughnessFactor = val
        addRefreshFactorsSystem(this)
    }

    private _opacityFactor?: number
    public get opacityFactor() {
        return this._opacityFactor
    }
    public set opacityFactor(val) {
        this._opacityFactor = val
        addRefreshFactorsSystem(this)
    }

    private _envFactor?: number
    public get envFactor() {
        return this._envFactor
    }
    public set envFactor(val) {
        this._envFactor = val
        addRefreshFactorsSystem(this)
    }

    private _reflection?: boolean
    public get reflection() {
        return this._reflection ?? false
    }
    public set reflection(val: boolean) {
        val !== this._reflection && reflectionChangedSet.add(this)
        this._reflection = val
        addRefreshFactorsSystem(this)
    }

    public find(name: string) {
        if (!this.$loadedObject3d) return
        const child = indexChildrenNames(this.$loadedObject3d).get(
            PropertyBinding.sanitizeNodeName(name)
        )
        if (child) return getFoundManager(child, this)
    }

    private _findFirst(
        name: (childName: string) => boolean,
        children: Map<string, Object3D>
    ) {
        for (const child of children.values())
            if (name(child.name)) return getFoundManager(child, this)
    }
    public findFirst(name: string | ((childName: string) => boolean)) {
        if (!this.$loadedObject3d) return
        if (typeof name === "string") return findFirst(this, name)
        return this._findFirst(name, indexChildrenNames(this.$loadedObject3d))
    }
    public findFirstMesh(name: string | ((childName: string) => boolean)) {
        if (!this.$loadedObject3d) return
        if (typeof name === "string") return findFirstMesh(this, name)
        return this._findFirst(
            name,
            indexMeshChildrenNames(this.$loadedObject3d)
        )
    }

    private _findAll(
        name: (childName: string) => boolean,
        children: Map<string, Object3D>
    ) {
        const result: Array<FoundManager> = []
        for (const child of children.values())
            name(child.name) && result.push(getFoundManager(child, this))

        return result
    }
    public findAll(name?: string | ((childName: string) => boolean)) {
        if (!this.$loadedObject3d) return []
        if (!name) return findAll(this, "")
        else if (typeof name === "string") return findAll(this, name)
        return this._findAll(name, indexChildrenNames(this.$loadedObject3d))
    }
    public findAllMeshes(name?: string | ((childName: string) => boolean)) {
        if (!this.$loadedObject3d) return []
        if (!name) return findAllMeshes(this, "")
        else if (typeof name === "string") return findAllMeshes(this, name)
        return this._findAll(name, indexMeshChildrenNames(this.$loadedObject3d))
    }
}
