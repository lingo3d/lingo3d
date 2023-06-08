import { Events } from "@lincode/events"
import { Cancellable, Disposable } from "@lincode/promiselikes"
import { GetGlobalState, createEffect, Reactive } from "@lincode/reactivity"
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
import { GameObjectType } from "../../api/serializer/types"
import { loopSystem } from "../../systems/loopSystem"
import { emitSceneGraphChangeSystem } from "../../systems/configSystems/emitSceneGraphChangeSystem"
import type { System } from "../../systems/utils/createInternalSystem"

type EventName = "name" | "runtimeSchema" | "loaded"

export default class Appendable extends Disposable implements IAppendable {
    public constructor() {
        super()
        appendableRoot.add(this)
        emitSceneGraphChangeSystem.add(this)
    }

    public get componentName(): GameObjectType {
        return getStaticProperties(this).componentName
    }

    public runtimeData: Nullable<Record<string, any>>
    public runtimeDefaults: Nullable<Record<string, any>>
    public parent?: Appendable | MeshAppendable
    public children?: Set<Appendable>

    public get firstChild() {
        const [firstChild] = this.children ?? [undefined]
        return firstChild
    }

    private _firstChildState?: Reactive<Appendable | undefined>
    protected get firstChildState() {
        return (this._firstChildState ??= new Reactive(this.firstChild))
    }

    private refreshFirstChildState() {
        this._firstChildState?.set(this.firstChild)
    }

    public $appendNode(child: Appendable) {
        appendableRoot.delete(child)
        emitSceneGraphChangeSystem.add(child)

        const { parent } = child
        if (parent) {
            parent.children!.delete(child)
            parent.refreshFirstChildState()
        }
        child.parent = this
        ;(this.children ??= new Set()).add(child)
        this.refreshFirstChildState()
    }

    public append(child: Appendable) {
        this.$appendNode(child)
    }

    public attach(child: Appendable) {
        this.$appendNode(child)
    }

    private _systems?: Map<string, System<any, any>>
    public get $systems() {
        return (this._systems ??= new Map<string, System<any, any>>())
    }

    protected disposeNode() {
        this._uuid && uuidMap.delete(this._uuid)
        this._id && userIdMap.get(this._id)!.delete(this)
        if (this.handles)
            for (const handle of this.handles.values()) handle.cancel()
        if (this._systems)
            for (const system of this._systems.values()) system.delete(this)
        emitDispose(this)
    }

    private disposeChildren() {
        super.dispose()
        this.disposeNode()
        if (this.children)
            for (const child of this.children) child.disposeChildren()
    }

    public override dispose() {
        if (this.done) return this
        this.disposeChildren()

        const { parent } = this
        if (parent) {
            parent.children!.delete(this)
            parent.refreshFirstChildState()
        } else appendableRoot.delete(this)

        emitSceneGraphChangeSystem.add(this)
        return this
    }

    public traverse(cb: (appendable: Appendable) => void) {
        for (const child of this.children ?? []) {
            cb(child)
            child.traverse(cb)
        }
    }

    public traverseSome(cb: (appendable: Appendable) => unknown) {
        for (const child of this.children ?? []) {
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

    private handles?: Map<string, Cancellable>
    public cancelHandle(
        name: string,
        lazyHandle: undefined | false | "" | (() => Cancellable)
    ) {
        const handles = (this.handles ??= new Map<string, Cancellable>())
        handles.get(name)?.cancel()

        if (!lazyHandle) return

        const handle = lazyHandle()
        handles.set(name, handle)
        return handle
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

    public $unghost() {
        this.$disableSerialize = false
        this.$disableSceneGraph = false
        this.$disableSelection = false
        emitSceneGraphChangeSystem.delete(this)
    }
}
