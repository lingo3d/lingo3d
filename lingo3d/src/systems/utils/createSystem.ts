import { Cancellable } from "@lincode/promiselikes"
import type Appendable from "../../display/core/Appendable"
import { onBeforeRender } from "../../events/onBeforeRender"
import { onAfterRender } from "../../events/onAfterRender"
import { onRender } from "../../events/onRender"
import { onLoop } from "../../events/onLoop"
import { assertExhaustive } from "@lincode/utils"

const createSetupSystem = <T extends object | Appendable>(
    cb: (target: T) => void | false,
    cleanup: ((target: T) => void) | undefined,
    ticker: typeof onBeforeRender | typeof queueMicrotask
) => {
    const queued = new Set<T>()
    const needsCleanUp = cleanup && new WeakSet<T>()

    const execute = cleanup
        ? () => {
              for (const target of queued) {
                  if (needsCleanUp!.has(target)) {
                      cleanup(target)
                      needsCleanUp!.delete(target)
                  }
                  cb(target) !== false && needsCleanUp!.add(target)
              }
              queued.clear()
              started = false
          }
        : () => {
              for (const target of queued) cb(target)
              queued.clear()
              started = false
          }

    let started = false
    const start = () => {
        if (started) return
        started = true
        ticker(execute, true)
    }

    const deleteSystem = cleanup
        ? (item: T) => {
              "$deleteSystemSet" in item &&
                  item.$deleteSystemSet.delete(deleteSystem)
              if (needsCleanUp!.has(item)) {
                  cleanup(item)
                  needsCleanUp!.delete(item)
              }
              queued.delete(item)
          }
        : (item: T) => {
              "$deleteSystemSet" in item &&
                  item.$deleteSystemSet.delete(deleteSystem)
              queued.delete(item)
          }
    return <const>[
        (item: T) => {
            if (queued.has(item)) return
            start()
            queued.add(item)
            "$deleteSystemSet" in item &&
                item.$deleteSystemSet.add(deleteSystem)
        },
        deleteSystem
    ]
}

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

type Options<
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
> = {
    data?: Data | ((gameObject: GameObject) => Data)
    setup?: (gameObject: GameObject) => void
    cleanup?: (gameObject: GameObject) => void
    update?: (gameObject: GameObject, data: Data) => void
    ticker?: Ticker
    setupTicker?: SetupTicker
    beforeTick?: (queued: Map<GameObject, Data> | Set<GameObject>) => void
    afterTick?: (queued: Map<GameObject, Data> | Set<GameObject>) => void
    sort?: (a: GameObject, b: GameObject) => number
}

const createSystem = <
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
>(
    options: Options<GameObject, Data>
) => {
    const [add, remove] = options.data
        ? withData<GameObject, Exclude<Data, void>>(options as any)
        : noData<GameObject>(options as any)
    return { add, delete: remove }
}
export default createSystem

const withData = <
    GameObject extends object | Appendable,
    Data extends Record<string, any>
>({
    data,
    setup,
    cleanup,
    update,
    ticker,
    setupTicker = queueMicrotask,
    beforeTick,
    afterTick,
    sort
}: Options<GameObject, Data>) => {
    const queued = new Map<GameObject, Data>()

    const [addSetupSystem, deleteSetupSystem] = setup
        ? createSetupSystem(setup, cleanup, mapSetupTicker(setupTicker))
        : [() => {}, () => {}]

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
    const start = update ? () => (handle = onEvent(execute)) : () => {}

    const deleteSystem = update
        ? (item: GameObject) => {
              deleteSetupSystem(item)
              if (!queued.has(item)) return
              queued.delete(item)
              "$deleteSystemSet" in item &&
                  item.$deleteSystemSet.delete(deleteSystem)
              queued.size === 0 && handle?.cancel()
          }
        : deleteSetupSystem

    const addSystem = update
        ? (item: GameObject, initData?: Data) => {
              addSetupSystem(item)
              if (queued.has(item)) {
                  initData && queued.set(item, initData)
                  return
              }
              queued.set(
                  item,
                  initData ??
                      (typeof data === "function" ? data(item) : { ...data! })
              )
              "$deleteSystemSet" in item &&
                  item.$deleteSystemSet.add(deleteSystem)
              queued.size === 1 && start()
          }
        : addSetupSystem

    return <const>[addSystem, deleteSystem]
}

const noData = <GameObject extends object | Appendable>({
    setup,
    cleanup,
    update,
    ticker,
    setupTicker = queueMicrotask,
    beforeTick,
    afterTick,
    sort
}: Options<GameObject, void>) => {
    const queued = new Set<GameObject>()
    const [addSetupSystem, deleteSetupSystem] = setup
        ? createSetupSystem(setup, cleanup, mapSetupTicker(setupTicker))
        : [() => {}, () => {}]

    const execute =
        beforeTick || afterTick
            ? sort
                ? () => {
                      beforeTick?.(queued)
                      for (const target of [...queued].sort(sort))
                          update!(target)
                      afterTick?.(queued)
                  }
                : () => {
                      beforeTick?.(queued)
                      for (const target of queued) update!(target)
                      afterTick?.(queued)
                  }
            : sort
            ? () => {
                  for (const target of [...queued].sort(sort)) update!(target)
              }
            : () => {
                  for (const target of queued) update!(target)
              }

    let handle: Cancellable | undefined
    const onEvent = mapTicker(ticker ?? "beforeRender")
    const start = update ? () => (handle = onEvent(execute)) : () => {}

    const deleteSystem = update
        ? (item: GameObject) => {
              deleteSetupSystem(item)
              if (!queued.delete(item)) return
              "$deleteSystemSet" in item &&
                  item.$deleteSystemSet.delete(deleteSystem)
              queued.size === 0 && handle?.cancel()
          }
        : deleteSetupSystem

    const addSystem = update
        ? (item: GameObject) => {
              addSetupSystem(item)
              if (queued.has(item)) return
              queued.add(item)
              "$deleteSystemSet" in item &&
                  item.$deleteSystemSet.add(deleteSystem)
              queued.size === 1 && start()
          }
        : addSetupSystem

    return <const>[addSystem, deleteSystem]
}
