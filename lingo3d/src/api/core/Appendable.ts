import { Cancellable, Disposable } from "@lincode/promiselikes"
import { GetGlobalState, createEffect } from "@lincode/reactivity"
import { nanoid } from "nanoid"
import { Object3D } from "three"
import { timer } from "../../engine/eventLoop"
import { onBeforeRender } from "../../events/onBeforeRender"
import { emitDispose } from "../../events/onDispose"
import { emitSceneGraphChange } from "../../events/onSceneGraphChange"
import unsafeSetValue from "../../utils/unsafeSetValue"
import { setManager } from "../utils/manager"
import { appendableRoot, uuidMap } from "./collections"

export default class Appendable<
    T extends Object3D = Object3D
> extends Disposable {
    public nativeObject3d: Object3D

    public constructor(public outerObject3d: T = new Object3D() as T) {
        super()
        setManager(outerObject3d, this)
        this.nativeObject3d = outerObject3d

        appendableRoot.add(this)
        emitSceneGraphChange()
    }

    public parent?: Appendable
    public children?: Set<Appendable>

    protected _append(child: Appendable) {
        appendableRoot.delete(child)
        emitSceneGraphChange()

        child.parent?.children?.delete(child)
        child.parent = this
        ;(this.children ??= new Set()).add(child)
    }

    public append(child: Appendable) {
        this._append(child)
        this.outerObject3d.add(child.outerObject3d)
    }

    public attach(child: Appendable) {
        this._append(child)
        this.outerObject3d.attach(child.outerObject3d)
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()

        this._uuid !== undefined && uuidMap.delete(this._uuid)
        if (this.handles)
            for (const handle of this.handles.values()) handle.cancel()

        appendableRoot.delete(this)
        this.parent?.children?.delete(this)
        this.parent = undefined

        emitSceneGraphChange()
        emitDispose(this)

        this.outerObject3d.parent?.remove(this.outerObject3d)

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

    public beforeRender(cb: () => void) {
        return this.watch(onBeforeRender(cb))
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
    protected cancelHandle(
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
        this.cancelHandle("onLoop", cb && (() => onBeforeRender(cb)))
    }
}
