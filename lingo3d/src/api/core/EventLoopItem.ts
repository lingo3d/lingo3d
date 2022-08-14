import { Cancellable } from "@lincode/promiselikes"
import { createEffect, GetGlobalState } from "@lincode/reactivity"
import { Object3D } from "three"
import { timer } from "../../engine/eventLoop"
import { onBeforeRender } from "../../events/onBeforeRender"
import IEventLoop from "../../interface/IEventLoop"
import Appendable from "./Appendable"

export default abstract class EventLoopItem<T extends Object3D = Object3D>
    extends Appendable<T>
    implements IEventLoop
{
    private _proxy?: EventLoopItem
    public get proxy() {
        return this._proxy
    }
    public set proxy(val) {
        //@ts-ignore
        this._proxy && (this._proxy.__target = undefined)
        this._proxy = val
        //@ts-ignore
        val && (val.__target = this)
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

    public override dispose() {
        if (this.done) return this
        super.dispose()

        if (this.handles)
            for (const handle of this.handles.values()) handle.cancel()

        return this
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
