import { Cancellable } from "@lincode/promiselikes"
import Appendable from "../../display/core/Appendable"

export type On<T> = (cb: (val: T) => void, once?: boolean) => Cancellable

export type EffectTicker =
    | On<void>
    | typeof queueMicrotask
    | [() => Promise<void>]

export type SystemOptions<
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void,
    EventData extends
        | Record<string, any>
        | string
        | boolean
        | number
        | Array<any>
        | Function
        | void
> = {
    data?: Data | ((gameObject: GameObject) => Data)
    effect?: (gameObject: GameObject, data: Data) => void | false
    cleanup?: (gameObject: GameObject, data: Data) => void
    update?: (gameObject: GameObject, data: Data, eventData: EventData) => void
    updateTicker?: On<EventData | void>
    effectTicker?: EffectTicker
    beforeTick?: (queued: Map<GameObject, Data> | Set<GameObject>) => void
    afterTick?: (queued: Map<GameObject, Data> | Set<GameObject>) => void
    sort?: (a: GameObject, b: GameObject) => number
    disableRepeatAdd?: boolean
}

export type System<
    GameObject extends object | Appendable = any,
    Data extends Record<string, any> | void = any
> = {
    name: string
    add: (item: GameObject, initData?: Data) => void
    delete: (item: GameObject) => void
    dispose: () => void
    queued: Array<GameObject>
}
