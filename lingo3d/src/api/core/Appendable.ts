import { Cancellable, Disposable } from "@lincode/promiselikes"
import { GetGlobalState, createEffect, Reactive } from "@lincode/reactivity"
import { nanoid } from "nanoid"
import { timer } from "../../engine/eventLoop"
import { emitDispose } from "../../events/onDispose"
import { onLoop } from "../../events/onLoop"
import { emitSceneGraphChange } from "../../events/onSceneGraphChange"
import IAppendable from "../../interface/IAppendable"
import renderSystem from "../../utils/renderSystem"
import unsafeGetValue from "../../utils/unsafeGetValue"
import unsafeSetValue from "../../utils/unsafeSetValue"
import { appendableRoot, uuidMap } from "./collections"
import MeshAppendable from "./MeshAppendable"

const [addLoopSystem, deleteLoopSystem] = renderSystem((cb: () => void) => {
    cb()
}, onLoop)

export default class Appendable extends Disposable implements IAppendable {
    public constructor() {
        super()
        appendableRoot.add(this)
        emitSceneGraphChange()
    }

    public get componentName(): string {
        return unsafeGetValue(this.constructor, "componentName")
    }

    public parent?: Appendable | MeshAppendable
    public children?: Set<Appendable>

    public get firstChild() {
        const [firstChild] = this.children ?? [undefined]
        return firstChild
    }

    private _firstChildState?: Reactive<Appendable | undefined>
    public get firstChildState() {
        return (this._firstChildState ??= new Reactive(this.firstChild))
    }

    private refreshFirstChildState() {
        this._firstChildState?.set(this.firstChild)
    }

    protected _append(child: Appendable) {
        appendableRoot.delete(child)
        emitSceneGraphChange()

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
        this._append(child)
    }

    protected _dispose() {
        this._uuid !== undefined && uuidMap.delete(this._uuid)
        if (this.handles)
            for (const handle of this.handles.values()) handle.cancel()

        appendableRoot.delete(this)

        const { parent } = this
        if (parent) {
            parent.children!.delete(this)
            parent.refreshFirstChildState()
            this.parent = undefined
        }
        emitSceneGraphChange()
        emitDispose(this)
    }
    public override dispose() {
        if (this.done) return this
        super.dispose()
        this._dispose()
        if (this.children) for (const child of this.children) child.dispose()
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

    private _uuid?: string
    public get uuid() {
        if (this._uuid !== undefined) return this._uuid
        const val = (this._uuid = nanoid())
        uuidMap.set(val, this)
        return val
    }
    public set uuid(val) {
        if (this._uuid !== undefined) return
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

    public timer(time: number, repeat: number, cb: () => void) {
        return this.watch(timer(time, repeat, cb))
    }

    public queueMicrotask(cb: () => void) {
        queueMicrotask(() => !this.done && cb())
    }

    protected cancellable(cb?: () => void) {
        return this.watch(new Cancellable(cb))
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
        this.cancelHandle(
            "onLoop",
            cb &&
                (() => {
                    addLoopSystem(cb)
                    return new Cancellable(() => deleteLoopSystem(cb))
                })
        )
    }
    public registerOnLoop(cb: () => void) {
        addLoopSystem(cb)
        return this.watch(new Cancellable(() => deleteLoopSystem(cb)))
    }
}
