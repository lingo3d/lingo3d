import { AnimationClip, Group, Object3D, PropertyBinding } from "three"
import fit from "./utils/fit"
import Loaded from "./core/Loaded"
import IModel, { modelDefaults, modelSchema } from "../interface/IModel"
import FoundManager from "./core/FoundManager"
import AnimationManager from "./core/AnimatedObjectManager/AnimationManager"
import { M2CM } from "../globals"
import {
    reflectionDataMap,
    reflectionChangedSet
} from "../collections/reflectionCollections"
import { measure } from "../memo/measure"
import { indexChildrenNames } from "../memo/indexChildrenNames"
import { getFoundManager } from "./core/utils/getFoundManager"
import { indexMeshChildrenNames } from "../memo/indexMeshChildrenNames"
import loadModel from "./utils/loaders/loadModel"
import getRendered from "../throttle/getRendered"
import { configFactorsSystem } from "../systems/configLoadedSystems/configFactorsSystem"
import { configCastShadowSystem } from "../systems/configLoadedSystems/configCastShadowSystem"
import { configRenderCheckModelSystem } from "../systems/configSystems/configRenderCheckModelSystem"
import { returnTrue } from "./utils/reusables"
import { configModelSrcSystem } from "../systems/configLoadedSystems/configModelSrcSystem"
import { configModelAnimationSystem } from "../systems/configLoadedSystems/configModelAnimationSystem"

export default class Model extends Loaded<Group> implements IModel {
    public static componentName = "model"
    public static defaults = modelDefaults
    public static schema = modelSchema

    public $animationUrls?: Record<string, string>
    public $animationClips?: Record<string, AnimationClip>

    private async loadAnimation(url: string, name: string) {
        ;(this.$animationUrls ??= {})[name] = url
        const clip = (await loadModel(url, false)).animations[0]
        if (!clip) return
        ;(this.$animationClips ??= {})[name] = clip
        configModelAnimationSystem.add(this)
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

    public $load(url: string) {
        return loadModel(url, true)
    }

    private _resize?: boolean
    public get resize() {
        return this._resize ?? true
    }
    public set resize(val) {
        this._resize = val
        this.$loadedObject && (this.src = this._src)
    }

    public $resolveLoaded(loadedObject: Group, src: string) {
        for (const clip of loadedObject.animations)
            (this.$animationClips ??= {})[clip.name] = clip
        configModelAnimationSystem.add(this)

        const [{ x, y, z }] =
            this._resize === false
                ? measure(src, { target: loadedObject })
                : fit(loadedObject, src)

        this.runtimeDefaults = {
            width: x * M2CM,
            height: y * M2CM,
            depth: z * M2CM
        }
        !this.widthSet && (this.$innerObject.scale.x = x)
        !this.heightSet && (this.$innerObject.scale.y = y)
        !this.depthSet && (this.$innerObject.scale.z = z)

        return loadedObject
    }

    public override get src() {
        return super.src
    }
    public override set src(val) {
        super.src = val
        configModelSrcSystem.add(this)
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
        configFactorsSystem.add(this)
    }

    private _roughnessFactor?: number
    public get roughnessFactor() {
        return this._roughnessFactor
    }
    public set roughnessFactor(val) {
        this._roughnessFactor = val
        configFactorsSystem.add(this)
    }

    private _normalFactor?: number
    public get normalFactor() {
        return this._normalFactor
    }
    public set normalFactor(val) {
        this._normalFactor = val
        configFactorsSystem.add(this)
    }

    private _opacityFactor?: number
    public get opacityFactor() {
        return this._opacityFactor
    }
    public set opacityFactor(val) {
        this._opacityFactor = val
        configFactorsSystem.add(this)
        configCastShadowSystem.add(this)
    }

    private _envFactor?: number
    public get envFactor() {
        return this._envFactor
    }
    public set envFactor(val) {
        this._envFactor = val
        configFactorsSystem.add(this)
    }

    private _reflection?: boolean
    public get reflection() {
        return this._reflection ?? false
    }
    public set reflection(val: boolean) {
        val !== this._reflection && reflectionChangedSet.add(this)
        this._reflection = val
        configFactorsSystem.add(this)
    }

    public find(name: string) {
        if (!this.$loadedObject) return
        const child = indexChildrenNames(this.$loadedObject).get(
            PropertyBinding.sanitizeNodeName(name)
        )
        if (child) return getFoundManager(child, this)
    }

    private _findFirst(
        predicate: (childName: string) => boolean,
        children: Map<string, Object3D>
    ) {
        for (const child of children.values())
            if (predicate(child.name)) return getFoundManager(child, this)
    }
    public findFirst(predicate: (childName: string) => boolean) {
        if (!this.$loadedObject) return
        return this._findFirst(
            predicate,
            indexChildrenNames(this.$loadedObject)
        )
    }
    public findFirstMesh(predicate: (childName: string) => boolean) {
        if (!this.$loadedObject) return
        return this._findFirst(
            predicate,
            indexMeshChildrenNames(this.$loadedObject)
        )
    }

    private _findAll(
        predicate: (childName: string) => boolean = returnTrue,
        children: Map<string, Object3D>
    ) {
        const result: Array<FoundManager> = []
        for (const child of children.values())
            predicate(child.name) && result.push(getFoundManager(child, this))

        return result
    }
    public findAll(predicate?: (childName: string) => boolean) {
        if (!this.$loadedObject) return []
        return this._findAll(predicate, indexChildrenNames(this.$loadedObject))
    }
    public findAllMeshes(predicate?: (childName: string) => boolean) {
        if (!this.$loadedObject) return []
        return this._findAll(
            predicate,
            indexMeshChildrenNames(this.$loadedObject)
        )
    }

    public override get isRendered() {
        if (!this.$loadedObject) return false
        configRenderCheckModelSystem.add(this)
        return getRendered().has(this)
    }
}
