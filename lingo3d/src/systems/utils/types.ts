import { Cancellable } from "@lincode/promiselikes"

export type On<T> = (cb: (val: T) => void, once?: boolean) => Cancellable

export type EffectTicker =
    | On<void>
    | typeof queueMicrotask
    | [() => Promise<void>]
