import { Cancellable } from "@lincode/promiselikes"

export default class ReactiveSet<T> extends Set<T> {
    public override add(val: T) {
        super.add(val)
        for (const [cb, handle] of this.cbs) cb(handle)
        return this
    }

    public override delete(val: T) {
        const result = super.delete(val)
        if (result) for (const [cb, handle] of this.cbs) cb(handle)
        return result
    }

    private cbs = new Map<(handle: Cancellable) => void, Cancellable>()
    public effect(cb: (handle: Cancellable) => void) {
        const handle = new Cancellable(() => this.cbs.delete(cb))
        this.cbs.set(cb, handle)
        cb(handle)
        return handle
    }
}
