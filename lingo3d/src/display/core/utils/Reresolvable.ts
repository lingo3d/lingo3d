type CbResult = (() => void) | void

export default class Reresolvable<T> {
    public done?: boolean = undefined
    private value?: T = undefined
    private callbacks: Array<(val: T) => CbResult> = []
    private cleanups: Array<() => void> = []

    public then(cb: (val: T) => CbResult) {
        this.callbacks.push(cb)
        
        if (this.done) {
            const cleanup = cb(this.value!)
            cleanup && this.cleanups.push(cleanup)
        }
    }

    protected resolve(val: T) {
        this.done = true
        this.value = val

        for (const cleanup of this.cleanups) cleanup()
        this.cleanups = []
        
        for (const cb of this.callbacks) {
            const cleanup = cb(val)
            cleanup && this.cleanups.push(cleanup)
        }
    }
}