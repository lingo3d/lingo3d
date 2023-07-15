import { Events } from "@lincode/events"
import { Disposable } from "@lincode/promiselikes"
import { GetGlobalState, createEffect } from "@lincode/reactivity"
import { forceGetInstance } from "@lincode/utils"
import { nanoid } from "nanoid"
import getStaticProperties from "../utils/getStaticProperties"
import { emitDispose } from "../../events/onDispose"
import IAppendable from "../../interface/IAppendable"
import Nullable from "../../interface/utils/Nullable"
import unsafeSetValue from "../../utils/unsafeSetValue"
import type MeshAppendable from "./MeshAppendable"
import { appendableRoot } from "../../collections/appendableRoot"
import { userIdMap, uuidMap } from "../../collections/idCollections"
import { emitId } from "../../events/onId"
import { loopSystem } from "../../systems/loopSystem"
import { emitSceneGraphChangeSystem } from "../../systems/configSystems/emitSceneGraphChangeSystem"
import type { System } from "../../systems/utils/createInternalSystem"
import { userlandNameSystemMap } from "../../collections/userlandNameSystemMap"
import { updateSystemsSystem } from "../../systems/updateSystemsSystem"
import { emitSceneGraphChange } from "../../events/onSceneGraphChange"

type EventName = "name" | "loaded"

const isUserlandSystem = (name: string) => userlandNameSystemMap.has(name)

export default class Appendable extends Disposable implements IAppendable {
    public constructor() {
        super()
        appendableRoot.add(this)
        emitSceneGraphChangeSystem.add(this)
    }

    public get componentName() {
        return getStaticProperties(this).componentName
    }

    public get type() {
        return this.componentName
    }

    public runtimeDefaults: Nullable<Record<string, any>>
    public parent?: Appendable | MeshAppendable
    public children?: Set<Appendable>

    public $appendNode(child: Appendable) {
        appendableRoot.delete(child)
        emitSceneGraphChangeSystem.add(child)
        child.parent?.children!.delete(child)
        child.parent = this
        ;(this.children ??= new Set()).add(child)
    }

    public append(child: Appendable) {
        this.$appendNode(child)
    }

    public attach(child: Appendable) {
        this.$appendNode(child)
    }

    private _systems?: Map<string, System>
    public get $systems() {
        return (this._systems ??= new Map<string, System>())
    }

    public get systems() {
        return this._systems
            ? [...this._systems.keys()].filter(isUserlandSystem)
            : []
    }
    public set systems(names) {
        if (this._systems)
            for (const system of this._systems.values())
                isUserlandSystem(system.name) && system.delete(this)
        updateSystemsSystem.add(this, { names })
    }

    protected disposeNode() {
        this._uuid && uuidMap.delete(this._uuid)
        this._id && userIdMap.get(this._id)!.delete(this)
        if (this._systems)
            for (const system of this._systems.values()) system.delete(this)
        emitDispose(this)
    }
    public override dispose(notCaller?: boolean) {
        if (this.done) return this
        super.dispose()
        this.disposeNode()
        if (this.children)
            for (const child of this.children) child.dispose(true)

        if (notCaller) {
            disposeObject(this)
            return this
        }
        ;(this.parent?.children ?? appendableRoot).delete(this)
        !this.$disableSceneGraph && emitSceneGraphChange()
        disposeObject(this)
        return this
    }

    public traverse(cb: (appendable: Appendable) => void) {
        if (!this.children) return
        for (const child of this.children) {
            if (child.$disableSceneGraph) continue
            cb(child)
            child.traverse(cb)
        }
    }

    public traverseSome(cb: (appendable: Appendable) => unknown) {
        if (!this.children) return
        for (const child of this.children) {
            if (child.$disableSceneGraph) continue
            if (cb(child)) return true
            child.traverseSome(cb)
        }
        return false
    }

    private _events?: Events<any, EventName>
    public get $events() {
        return (this._events ??= new Events())
    }
    public $emitEvent(key: EventName, payload?: any) {
        this._events?.emit(key, payload)
    }

    protected _name?: string
    public get name() {
        return this._name
    }
    public set name(val) {
        this._name = val
        this.$emitEvent("name")
    }

    protected _id?: string
    public get id() {
        return this._id
    }
    public set id(val) {
        this._id && userIdMap.get(this._id)!.delete(this)
        this._id = val
        val && forceGetInstance(userIdMap, val, Set).add(this)
        emitId(this)
    }

    private _uuid?: string
    public get uuid() {
        if (this._uuid) return this._uuid
        const val = (this._uuid = nanoid())
        uuidMap.set(val, this)
        return val
    }
    public set uuid(val) {
        if (this._uuid) return
        this._uuid = val
        uuidMap.set(val, this)
    }

    private _proxy?: Appendable
    public get proxy() {
        return this._proxy
    }
    public set proxy(val) {
        this._proxy && unsafeSetValue(this._proxy, "__target", undefined)
        this._proxy = val
        val && unsafeSetValue(val, "__target", this)
    }

    protected createEffect(
        cb: () => (() => void) | void,
        getStates: Array<GetGlobalState<any> | any>
    ) {
        return this.watch(createEffect(cb, getStates))
    }

    private _onLoop?: () => void
    public get onLoop() {
        return this._onLoop
    }
    public set onLoop(cb) {
        this._onLoop = cb
        cb ? loopSystem.add(this) : loopSystem.delete(this)
    }

    public $disableSerialize?: boolean
    public $disableSceneGraph?: boolean
    public $disableUnload?: boolean
    public $disableSelection?: boolean

    public $ghost(disableSelection = true) {
        this.$disableSerialize = true
        this.$disableSceneGraph = true
        this.$disableSelection = disableSelection
        emitSceneGraphChangeSystem.delete(this)
    }
}

const disposeObject = (instance: InstanceType<any>) => {
    let currentPrototype = Object.getPrototypeOf(instance)
    while (currentPrototype) {
        for (const key of Object.getOwnPropertyNames(currentPrototype)) {
            if (key === "done" || key === "dispose") continue
            Object.defineProperty(instance, key, { value: undefined })
        }
        currentPrototype = Object.getPrototypeOf(currentPrototype)
    }
}
