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
    setup?: (gameObject: GameObject, data: Data) => void
    cleanup?: (gameObject: GameObject, data: Data) => void
    setupTicker?: Ticker
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

const cancellable = new Cancellable()
const microtaskTicker = (cb: () => void) => {
    queueMicrotask(cb)
    return cancellable
}

const withData = <
    GameObject extends object | Appendable,
    Data extends Record<string, any>
>({
    data,
    setup,
    cleanup,
    setupTicker,
    update,
    ticker,
    beforeTick,
    afterTick,
    sort
}: Options<GameObject, Data>) => {
    const queued = new Map<GameObject, Data>()
    const setupQueued = new Map<GameObject, Data>()
    const cleanupQueued = new Map<GameObject, Data>()

    let setupHandle: Cancellable | undefined
    let cleanupHandle: Cancellable | undefined
    const onSetupOrCleanup = mapTicker(setupTicker ?? microtaskTicker)

    const executeSetup = () => {
        for (const [target, data] of setupQueued) setup!(target, data)
        setupQueued.clear()
        setupHandle = undefined
    }
    const addSetup = (item: GameObject, data: Data) => {
        if (!setup) return
        setupQueued.set(item, data)

        if (setupHandle) return
        setupHandle = onSetupOrCleanup(executeSetup, true)
    }
    const executeCleanup = () => {
        for (const [target, data] of cleanupQueued) cleanup!(target, data)
        cleanupQueued.clear()
        cleanupHandle = undefined
    }
    const addCleanup = (item: GameObject, data: Data) => {
        if (!cleanup) return
        cleanupQueued.set(item, data)

        if (cleanupHandle) return
        cleanupHandle = onSetupOrCleanup(executeCleanup, true)
    }
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
        if (!queued.has(item)) return
        const _data = queued.get(item)!
        queued.delete(item)
        "$deleteSystemSet" in item && item.$deleteSystemSet.delete(deleteSystem)
        queued.size === 0 && handle?.cancel()
        addCleanup(item, _data)
    }
    return <const>[
        (item: GameObject, initData?: Data) => {
            if (queued.has(item)) {
                initData && queued.set(item, initData)
                return
            }
            const _data =
                initData ??
                (typeof data === "function" ? data(item) : { ...data! })
            queued.set(item, _data)
            "$deleteSystemSet" in item &&
                item.$deleteSystemSet.add(deleteSystem)
            queued.size === 1 && start()
            addSetup(item, _data)
        },
        deleteSystem
    ]
}

const noData = <GameObject extends object | Appendable>({
    setup,
    cleanup,
    setupTicker,
    update,
    ticker,
    beforeTick,
    afterTick,
    sort
}: Options<GameObject, void>) => {
    const queued = new Set<GameObject>()
    const setupQueued = new Set<GameObject>()
    const cleanupQueued = new Set<GameObject>()

    let setupHandle: Cancellable | undefined
    let cleanupHandle: Cancellable | undefined
    const onSetupOrCleanup = mapTicker(setupTicker ?? microtaskTicker)

    const executeSetup = () => {
        for (const target of setupQueued) setup!(target)
        setupQueued.clear()
        setupHandle = undefined
    }
    const addSetup = (item: GameObject) => {
        if (!setup) return
        setupQueued.add(item)

        if (setupHandle) return
        setupHandle = onSetupOrCleanup(executeSetup, true)
    }
    const executeCleanup = () => {
        for (const target of cleanupQueued) cleanup!(target)
        cleanupQueued.clear()
        cleanupHandle = undefined
    }
    const addCleanup = (item: GameObject) => {
        if (!cleanup) return
        cleanupQueued.add(item)

        if (cleanupHandle) return
        cleanupHandle = onSetupOrCleanup(executeCleanup, true)
    }
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
        if (!queued.delete(item)) return
        "$deleteSystemSet" in item && item.$deleteSystemSet.delete(deleteSystem)
        queued.size === 0 && handle?.cancel()
        addCleanup(item)
    }
    return <const>[
        (item: GameObject) => {
            if (queued.has(item)) return
            queued.add(item)
            "$deleteSystemSet" in item &&
                item.$deleteSystemSet.add(deleteSystem)
            queued.size === 1 && start()
            addSetup(item)
        },
        deleteSystem
    ]
}
