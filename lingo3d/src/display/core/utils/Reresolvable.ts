import { Cancellable } from "@lincode/promiselikes"
import { pull } from "@lincode/utils"

type CbResult = (() => void) | void

const cleanupMap = new WeakMap<(val: any) => CbResult, CbResult>()

const runCleanup = (cb: (val: any) => CbResult) => {
    if (cleanupMap.has(cb)) {
        cleanupMap.get(cb)!()
        cleanupMap.delete(cb)
    }
}

const run = <T>(cb: (val: T) => CbResult, val: T) => {
    runCleanup(cb)
    const cleanup = cb(val)
    cleanup && cleanupMap.set(cb, cleanup)
}

export default class Reresolvable<T> {
    public done?: boolean = undefined
    private value?: T = undefined
    private callbacks: Array<(val: T) => CbResult> = []

    public then(cb: (val: T) => CbResult): Cancellable {
        this.callbacks.push(cb)
        this.done && run(cb, this.value!)
        return new Cancellable(() => {
            pull(this.callbacks, cb)
            runCleanup(cb)
        })
    }

    public resolve(val: T) {
        for (const cb of this.callbacks) run(cb, val)

        this.done = true
        this.value = val
    }
}
