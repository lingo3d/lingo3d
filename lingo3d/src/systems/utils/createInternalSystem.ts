import { Cancellable } from "@lincode/promiselikes"
import type Appendable from "../../display/core/Appendable"
import { onBeforeRender } from "../../events/onBeforeRender"
import { onAfterRender } from "../../events/onAfterRender"
import { onRender } from "../../events/onRender"
import { onLoop } from "../../events/onLoop"
import { assertExhaustive } from "@lincode/utils"
import { createEffectSystem } from "./createEffectSystem"

type Ticker = "beforeRender" | "afterRender" | "render" | "loop"

type SetupTicker = Ticker | typeof queueMicrotask | [() => Promise<void>]

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

const isQueueMicrotastk = (ticker: any): ticker is typeof queueMicrotask =>
    ticker === queueMicrotask

const mapSetupTicker = (ticker: SetupTicker) => {
    if (Array.isArray(ticker)) return (cb: () => void) => ticker[0]().then(cb)
    if (isQueueMicrotastk(ticker)) return ticker
    return mapTicker(ticker)
}

export type SystemOptions<
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
> = {
    data?: Data | ((gameObject: GameObject) => Data)
    effect?: (gameObject: GameObject, data: Data) => void | false | (() => void)
    cleanup?: (gameObject: GameObject, data: Data) => void
    update?: (gameObject: GameObject, data: Data) => void
    updateTicker?: Ticker
    effectTicker?: SetupTicker
    beforeTick?: (queued: Map<GameObject, Data> | Set<GameObject>) => void
    afterTick?: (queued: Map<GameObject, Data> | Set<GameObject>) => void
    sort?: (a: GameObject, b: GameObject) => number
}

const placeholderFn = () => {}

export type System<
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
> = {
    name: string
    add: (item: GameObject, initData?: Data) => void
    delete: (item: GameObject) => void
    dispose: () => void
}

export default <
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
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
    }: SystemOptions<GameObject, Data>
) => {
    const queued = new Map<GameObject, Data>()

    const [addEffectSystem, deleteEffectSystem] = effect
        ? createEffectSystem(effect, cleanup, mapSetupTicker(effectTicker))
        : [placeholderFn, placeholderFn]

    const executeUpdate =
        update &&
        (beforeTick || afterTick
            ? sort
                ? () => {
                      beforeTick?.(queued)
                      for (const target of [...queued.keys()].sort(sort))
                          update!(target, queued.get(target)!)
                      afterTick?.(queued)
                  }
                : () => {
                      beforeTick?.(queued)
                      for (const [target, data] of queued) update!(target, data)
                      afterTick?.(queued)
                  }
            : sort
            ? () => {
                  for (const target of [...queued.keys()].sort(sort))
                      update!(target, queued.get(target)!)
              }
            : () => {
                  for (const [target, data] of queued) update!(target, data)
              })

    let handle: Cancellable | undefined
    const onUpdate = update && mapTicker(updateTicker)
    const startUpdateLoop =
        update && (() => (handle = onUpdate!(executeUpdate!)))

    const executeDelete = (item: GameObject) => {
        deleteEffectSystem(item)
        const deleted = queued.delete(item)
        deleted && "$systems" in item && item.$systems.delete(name)
        return deleted
    }

    const deleteSystem = update
        ? (item: GameObject) =>
              executeDelete(item) && queued.size === 0 && handle?.cancel()
        : executeDelete

    const executeSetup = (item: GameObject, initData?: Data) => {
        const _data =
            initData ??
            queued.get(item) ??
            (typeof data === "function"
                ? data(item)
                : data
                ? { ...data }
                : undefined)
        addEffectSystem(item, _data)
        return _data
    }

    const executeAdd = (item: GameObject, initData?: Data) => {
        const added = !queued.has(item)
        queued.set(item, executeSetup(item, initData))
        added && "$systems" in item && item.$systems.set(name, system)
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
        }
    }
    return system
}
