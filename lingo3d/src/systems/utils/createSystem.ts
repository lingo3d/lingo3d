import { Cancellable } from "@lincode/promiselikes"
import type Appendable from "../../display/core/Appendable"
import { onBeforeRender } from "../../events/onBeforeRender"
import { onAfterRender } from "../../events/onAfterRender"
import { onRender } from "../../events/onRender"
import { onLoop } from "../../events/onLoop"
import { assertExhaustive } from "@lincode/utils"

type Ticker =
    | "beforeRender"
    | "afterRender"
    | "render"
    | "loop"
    | ((cb: () => void) => Cancellable)

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

type Options<
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
> = {
    data?: Data | ((gameObject: GameObject) => Data)
    setup?: (gameObject: GameObject) => void
    cleanup?: (gameObject: GameObject) => void
    update?: (gameObject: GameObject, data: Data) => void
    ticker?: Ticker
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

const makeSetupCleanup = <GameObject extends object | Appendable>(
    setup?: (gameObject: GameObject) => void,
    cleanup?: (gameObject: GameObject) => void
) => {
    const setupQueued = setup && new Set<GameObject>()
    const cleanupQueued = cleanup && new WeakSet<GameObject>()

    let setupScheduled = false
    const executeSetup = cleanup
        ? () => {
              for (const target of setupQueued!) {
                  setup!(target)
                  cleanupQueued!.add(target)
              }
              setupScheduled = false
          }
        : () => {
              for (const target of setupQueued!) setup!(target)
              setupScheduled = false
          }
    const tryCleanup = cleanup
        ? (item: GameObject) => {
              if (!cleanupQueued!.has(item)) return
              cleanupQueued!.delete(item)
              cleanup(item)
          }
        : () => {}

    return <const>[
        setup
            ? (item: GameObject) => {
                  tryCleanup(item)
                  setupQueued!.add(item)

                  if (setupScheduled) return
                  setupScheduled = true

                  queueMicrotask(executeSetup)
              }
            : () => {},
        setup
            ? (item: GameObject) => {
                  tryCleanup(item)
                  setupQueued!.delete(item)
              }
            : tryCleanup
    ]
}

const withData = <
    GameObject extends object | Appendable,
    Data extends Record<string, any>
>({
    data,
    setup,
    cleanup,
    update,
    ticker,
    beforeTick,
    afterTick,
    sort
}: Options<GameObject, Data>) => {
    const queued = new Map<GameObject, Data>()
    const [addSetup, addCleanup] = makeSetupCleanup(setup, cleanup)

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

    const deleteSystem = (item: GameObject) => {
        addCleanup(item)
        if (!queued.has(item)) return
        queued.delete(item)
        "$deleteSystemSet" in item && item.$deleteSystemSet.delete(deleteSystem)
        queued.size === 0 && handle?.cancel()
    }
    return <const>[
        (item: GameObject, initData?: Data) => {
            addSetup(item)
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
        },
        deleteSystem
    ]
}

const noData = <GameObject extends object | Appendable>({
    setup,
    cleanup,
    update,
    ticker,
    beforeTick,
    afterTick,
    sort
}: Options<GameObject, void>) => {
    const queued = new Set<GameObject>()
    const [addSetup, addCleanup] = makeSetupCleanup(setup, cleanup)

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

    const deleteSystem = (item: GameObject) => {
        addCleanup(item)
        if (!queued.delete(item)) return
        "$deleteSystemSet" in item && item.$deleteSystemSet.delete(deleteSystem)
        queued.size === 0 && handle?.cancel()
    }
    return <const>[
        (item: GameObject) => {
            addSetup(item)
            if (queued.has(item)) return
            queued.add(item)
            "$deleteSystemSet" in item &&
                item.$deleteSystemSet.add(deleteSystem)
            queued.size === 1 && start()
        },
        deleteSystem
    ]
}
