import { Group, Object3D, PropertyBinding } from "three"
import fit from "./utils/fit"
import Loaded from "./core/Loaded"
import IModel, { modelDefaults, modelSchema } from "../interface/IModel"
import { Resolvable } from "@lincode/promiselikes"
import FoundManager from "./core/FoundManager"
import { Reactive } from "@lincode/reactivity"
import { getExtensionIncludingObjectURL } from "./core/utils/objectURL"
import {
    decreaseLoadingCount,
    increaseLoadingCount
} from "../states/useLoadingCount"
import AnimationManager from "./core/AnimatedObjectManager/AnimationManager"
import { M2CM } from "../globals"
import { addRefreshFactorsSystem } from "../systems/refreshFactorsSystem"
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

const supported = new Set(["fbx", "glb", "gltf"])

export default class Model extends Loaded<Group> implements IModel {
    public static componentName = "model"
    public static defaults = modelDefaults
    public static schema = modelSchema

    public constructor(private unmounted?: boolean) {
        super(unmounted)
    }

    private loadingState = new Reactive(0)

    protected override setAnimationManager(name?: string | number) {
        this.cancelHandle("modelSetAnimationManager", () =>
            this.loadingState.get((count, handle) => {
                if (count) return
                handle.cancel()
                super.setAnimationManager(name)
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
            await new Promise<Object3D>((resolve) =>
                this.events.once("loaded", resolve)
            ),
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
        this.loadedObject3d && (this.src = this._src)
    }

    protected resolveLoaded(loadedObject3d: Group, src: string) {
        if (this.unmounted) return loadedObject3d

        if (loadedObject3d.animations.length) {
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
        if (!this.loadedObject3d) return
        const child = indexChildrenNames(this.loadedObject3d).get(
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
        if (!this.loadedObject3d) return
        if (typeof name === "string") return findFirst(this, name)
        return this._findFirst(name, indexChildrenNames(this.loadedObject3d))
    }
    public findFirstMesh(name: string | ((childName: string) => boolean)) {
        if (!this.loadedObject3d) return
        if (typeof name === "string") return findFirstMesh(this, name)
        return this._findFirst(
            name,
            indexMeshChildrenNames(this.loadedObject3d)
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
        if (!this.loadedObject3d) return []
        if (!name) return findAll(this, "")
        else if (typeof name === "string") return findAll(this, name)
        return this._findAll(name, indexChildrenNames(this.loadedObject3d))
    }
    public findAllMeshes(name?: string | ((childName: string) => boolean)) {
        if (!this.loadedObject3d) return []
        if (!name) return findAllMeshes(this, "")
        else if (typeof name === "string") return findAllMeshes(this, name)
        return this._findAll(name, indexMeshChildrenNames(this.loadedObject3d))
    }
}
