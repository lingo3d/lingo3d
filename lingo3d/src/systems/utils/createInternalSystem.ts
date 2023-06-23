import { Cancellable } from "@lincode/promiselikes"
import type Appendable from "../../display/core/Appendable"
import { onBeforeRender } from "../../events/onBeforeRender"
import { onAfterRender } from "../../events/onAfterRender"
import { onRender } from "../../events/onRender"
import { onLoop } from "../../events/onLoop"
import { assertExhaustive } from "@lincode/utils"
import { createEffectSystem } from "./createEffectSystem"
import { onDispose } from "../../events/onDispose"

type Ticker = "beforeRender" | "afterRender" | "render" | "loop"
type EffectTicker = Ticker | typeof queueMicrotask | [() => Promise<void>]
type On<T> = (cb: (val: T) => void, once?: boolean) => Cancellable

const mapTicker = (ticker: Ticker) => {
    switch (ticker) {
        case "beforeRender":
            return onBeforeRender
        case "afterRender":
            return onAfterRender
        case "render":
            return onRender
        case "loop":
            return onLoop
        default:
            assertExhaustive(ticker)
    }
}

const mapEffectTicker = (ticker: EffectTicker) => {
    if (Array.isArray(ticker)) return (cb: () => void) => ticker[0]().then(cb)
    if (typeof ticker === "function") return ticker
    return mapTicker(ticker)
}

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
    effect?: (gameObject: GameObject, data: Data) => void | false | (() => void)
    cleanup?: (gameObject: GameObject, data: Data) => void
    update?: (gameObject: GameObject, data: Data, eventData: EventData) => void
    updateTicker?: Ticker | On<EventData>
    effectTicker?: EffectTicker
    beforeTick?: (queued: Map<GameObject, Data> | Set<GameObject>) => void
    afterTick?: (queued: Map<GameObject, Data> | Set<GameObject>) => void
    sort?: (a: GameObject, b: GameObject) => number
}

export type System<
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
> = {
    name: string
    add: (item: GameObject, initData?: Data) => void
    delete: (item: GameObject) => void
    dispose: () => void
    queued: Array<GameObject>
}

const placeholderFn = () => {}

export default <
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
>(
    name: string,
    {
        data,
        effect,
        cleanup,
        update,
        updateTicker = "beforeRender",
        effectTicker = queueMicrotask,
        beforeTick,
        afterTick,
        sort
    }: SystemOptions<GameObject, Data, EventData>
) => {
    const queued = new Map<GameObject, Data>()

    const [addEffectSystem, deleteEffectSystem] =
        effect || cleanup
            ? createEffectSystem(
                  effect ?? placeholderFn,
                  cleanup,
                  mapEffectTicker(effectTicker),
                  data ? queued : undefined
              )
            : [placeholderFn, placeholderFn]

    const executeUpdate =
        update &&
        (beforeTick || afterTick
            ? sort
                ? data
                    ? (eventData: EventData | void) => {
                          beforeTick?.(queued)
                          for (const target of [...queued.keys()].sort(sort))
                              update!(target, queued.get(target)!, eventData!)
                          afterTick?.(queued)
                      }
                    : (eventData: EventData | void) => {
                          beforeTick?.(queued)
                          for (const target of [...queued.keys()].sort(sort))
                              update!(target, undefined as any, eventData!)
                          afterTick?.(queued)
                      }
                : data
                ? (eventData: EventData | void) => {
                      beforeTick?.(queued)
                      for (const [target, data] of queued)
                          update!(target, data, eventData!)
                      afterTick?.(queued)
                  }
                : (eventData: EventData | void) => {
                      beforeTick?.(queued)
                      for (const target of queued.keys())
                          update!(target, undefined as any, eventData!)
                      afterTick?.(queued)
                  }
            : sort
            ? data
                ? (eventData: EventData | void) => {
                      for (const target of [...queued.keys()].sort(sort))
                          update!(target, queued.get(target)!, eventData!)
                  }
                : (eventData: EventData | void) => {
                      for (const target of [...queued.keys()].sort(sort))
                          update!(target, undefined as any, eventData!)
                  }
            : data
            ? (eventData: EventData | void) => {
                  for (const [target, data] of queued)
                      update!(target, data, eventData!)
              }
            : (eventData: EventData | void) => {
                  for (const target of queued.keys())
                      update!(target, undefined as any, eventData!)
              })

    let handle: Cancellable | undefined
    const onUpdate =
        update &&
        (typeof updateTicker === "string"
            ? mapTicker(updateTicker)
            : updateTicker)

    const startUpdateLoop =
        update && (() => (handle = onUpdate!(executeUpdate!)))

    //@ts-ignore
    const autoDelete = onUpdate !== onDispose
    const executeDelete = (item: GameObject) => {
        deleteEffectSystem(item)
        const deleted = queued.delete(item)
        deleted &&
            autoDelete &&
            "$systems" in item &&
            item.$systems.delete(name)
        return deleted
    }

    const deleteSystem = update
        ? (item: GameObject) =>
              executeDelete(item) && queued.size === 0 && handle?.cancel()
        : executeDelete

    const executeAdd = (item: GameObject, initData?: Data) => {
        const added = !queued.has(item)
        addEffectSystem(item)
        queued.set(
            item,
            initData ??
                queued.get(item) ??
                (typeof data === "function"
                    ? data(item)
                    : data
                    ? { ...data }
                    : undefined)
        )
        added &&
            autoDelete &&
            "$systems" in item &&
            item.$systems.set(name, system)
        return added
    }

    const addSystem = update
        ? (item: GameObject, initData?: Data) =>
              executeAdd(item, initData) &&
              queued.size === 1 &&
              startUpdateLoop!()
        : executeAdd

    const system: System<GameObject, Data> = {
        name,
        add: addSystem,
        delete: deleteSystem,
        dispose: () => {
            for (const [item] of queued) deleteSystem(item)
        },
        get queued() {
            return [...queued.keys()]
        }
    }
    return system
}
