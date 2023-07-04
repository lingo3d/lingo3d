import { Group, Object3D, PropertyBinding } from "three"
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
import findFirst from "../memo/findFirst"
import findFirstMesh from "../memo/findFirstMesh"
import findAll from "../memo/findAll"
import findAllMeshes from "../memo/findAllMeshes"
import loadModel from "./utils/loaders/loadModel"
import {
    idRenderCheckMap,
    idRenderCheckModelMap
} from "../collections/idCollections"
import getRendered from "../throttle/getRendered"
import { refreshFactorsSystem } from "../systems/configLoadedSystems/refreshFactorsSystem"
import { configCastShadowSystem } from "../systems/configLoadedSystems/configCastShadowSystem"

export default class Model extends Loaded<Group> implements IModel {
    public static componentName = "model"
    public static defaults = modelDefaults
    public static schema = modelSchema

    public $animationUrls?: Record<string, string>
    public async loadAnimation(url: string, name = url) {
        ;(this.$animationUrls ??= {})[name] = url

        const clip = (await loadModel(url, false)).animations[0]
        if (!clip) return

        this.append(
            (this.animations[name] = new AnimationManager(
                name,
                clip,
                await new Promise<Object3D>((resolve) =>
                    this.$events.once("loaded", resolve)
                ),
                this.$animationStates
            ))
        )
        if (name === this.animation) this.animation = name
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
                        this.$animationStates
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
        refreshFactorsSystem.add(this)
    }

    private _roughnessFactor?: number
    public get roughnessFactor() {
        return this._roughnessFactor
    }
    public set roughnessFactor(val) {
        this._roughnessFactor = val
        refreshFactorsSystem.add(this)
    }

    private _normalFactor?: number
    public get normalFactor() {
        return this._normalFactor
    }
    public set normalFactor(val) {
        this._normalFactor = val
        refreshFactorsSystem.add(this)
    }

    private _opacityFactor?: number
    public get opacityFactor() {
        return this._opacityFactor
    }
    public set opacityFactor(val) {
        this._opacityFactor = val
        refreshFactorsSystem.add(this)
        configCastShadowSystem.add(this)
    }

    private _envFactor?: number
    public get envFactor() {
        return this._envFactor
    }
    public set envFactor(val) {
        this._envFactor = val
        refreshFactorsSystem.add(this)
    }

    private _reflection?: boolean
    public get reflection() {
        return this._reflection ?? false
    }
    public set reflection(val: boolean) {
        val !== this._reflection && reflectionChangedSet.add(this)
        this._reflection = val
        refreshFactorsSystem.add(this)
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
        if (!name) return findAll(this.$loadedObject3d, "", { owner: this })
        if (typeof name === "string")
            return findAll(this.$loadedObject3d, name, { owner: this })
        return this._findAll(name, indexChildrenNames(this.$loadedObject3d))
    }
    public findAllMeshes(name?: string | ((childName: string) => boolean)) {
        if (!this.$loadedObject3d) return []
        if (!name)
            return findAllMeshes(this.$loadedObject3d, "", { owner: this })
        if (typeof name === "string")
            return findAllMeshes(this.$loadedObject3d, name, { owner: this })
        return this._findAll(name, indexMeshChildrenNames(this.$loadedObject3d))
    }

    private initRenderCheck?: boolean
    public override get isRendered() {
        if (!this.$loadedObject3d) return false
        if (!this.initRenderCheck) {
            this.initRenderCheck = true
            for (const child of this.findAllMeshes()) {
                idRenderCheckMap.set(child.object3d.id, child)
                idRenderCheckModelMap.set(child.object3d.id, this)
            }
            this.then(() => {
                for (const child of this.findAllMeshes()) {
                    idRenderCheckMap.delete(child.object3d.id)
                    idRenderCheckModelMap.delete(child.object3d.id)
                }
            })
        }
        return getRendered().has(this)
    }
}
