import { Cancellable } from "@lincode/promiselikes"
import type Appendable from "../../display/core/Appendable"
import { onBeforeRender } from "../../events/onBeforeRender"
import { onAfterRender } from "../../events/onAfterRender"
import { onRender } from "../../events/onRender"
import { onLoop } from "../../events/onLoop"
import { assertExhaustive } from "@lincode/utils"
import { createEffectSystem } from "./createEffectSystem"

type Ticker =
    | "beforeRender"
    | "afterRender"
    | "render"
    | "loop"
    | typeof onBeforeRender

type SetupTicker = Ticker | typeof queueMicrotask | [() => Promise<void>]

const mapTicker = (ticker: Ticker) => {
    if (typeof ticker === "function") return ticker
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
    ticker?: Ticker
    effectTicker?: SetupTicker
    beforeTick?: (queued: Map<GameObject, Data> | Set<GameObject>) => void
    afterTick?: (queued: Map<GameObject, Data> | Set<GameObject>) => void
    sort?: (a: GameObject, b: GameObject) => number
}

const placeholderFn = () => {}

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
        ticker,
        effectTicker = queueMicrotask,
        beforeTick,
        afterTick,
        sort
    }: SystemOptions<GameObject, Data>,
    userland?: boolean
) => {
    const queued = new Map<GameObject, Data>()

    const [addEffectSystem, deleteEffectSystem] = effect
        ? createEffectSystem(effect, cleanup, mapSetupTicker(effectTicker))
        : [placeholderFn, placeholderFn]

    const execute =
        beforeTick || afterTick
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
              }

    let handle: Cancellable | undefined
    const onEvent = mapTicker(ticker ?? "beforeRender")
    const start = update && (() => (handle = onEvent(execute)))

    const executeDelete = (item: GameObject) => {
        deleteEffectSystem(item)
        const deleted = queued.delete(item)
        deleted &&
            "$deleteSystemSet" in item &&
            item.$deleteSystemSet.delete(deleteSystem)
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
        added &&
            "$deleteSystemSet" in item &&
            item.$deleteSystemSet.add(deleteSystem)
        return added
    }

    const addSystem = update
        ? (item: GameObject, initData?: Data) =>
              executeAdd(item, initData) && queued.size === 1 && start!()
        : executeAdd

    return {
        add: addSystem,
        delete: deleteSystem
    }
}
