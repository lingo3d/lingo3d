import { Cancellable } from "@lincode/promiselikes"
import { createEffect, GetGlobalState } from "@lincode/reactivity"
import { loop, timer } from "../../engine/eventLoop"
import IEventLoop from "../../interface/IEventLoop"
import Appendable from "./Appendable"

export default abstract class EventLoopItem extends Appendable implements IEventLoop {
    public timer(time: number, cb: () => void): Cancellable
    public timer(time: number, repeat: number, cb: () => void) : Cancellable
    public timer(...args: Array<any>): Cancellable {
        //@ts-ignore
        return this.watch(timer(...args))
    }

    public loop(cb: () => void) {
        return this.watch(loop(cb))
    }

    public queueMicrotask(cb: () => void) {
        queueMicrotask(() => !this.done && cb())
    }

    protected cancellable(cb?: () => void) {
        return this.watch(new Cancellable(cb))
    }

    protected createEffect(cb: () => (() => void) | Promise<void> | void, getStates: Array<GetGlobalState<any> | any>) {
        return this.watch(createEffect(cb, getStates))
    }

    private _loopHandle?: Cancellable
    private _onLoop?: () => void
    public get onLoop(): (() => void) | undefined {
        return this._onLoop
    }
    public set onLoop(cb: (() => void) | undefined) {
        this._onLoop = cb
        this._loopHandle?.cancel()
        cb && (this._loopHandle = this.loop(cb))
    }
}