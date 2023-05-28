import { Cancellable } from "@lincode/promiselikes"
import type Appendable from "../../display/core/Appendable"
import { onBeforeRender } from "../../events/onBeforeRender"
import { onAfterRender } from "../../events/onAfterRender"
import { onRender } from "../../events/onRender"
import { onLoop } from "../../events/onLoop"
import { assertExhaustive } from "@lincode/utils"

type Ticker = "beforeRender" | "afterRender" | "render" | "loop"

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

type Options<
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
> = {
    data?: Data | ((gameObject: GameObject) => Data)
    setup?: (gameObject: GameObject, data: Data) => void
    cleanup?: (gameObject: GameObject, data: Data) => void
    update?: (gameObject: GameObject, data: Data) => void
    ticker?: Ticker
}

export default <
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

const withData = <
    GameObject extends object | Appendable,
    Data extends Record<string, any>
>({
    data,
    setup,
    cleanup,
    update,
    ticker
}: Options<GameObject, Data>) => {
    const queued = new Map<GameObject, Data>()

    const execute = () => {
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
        cleanup?.(item, _data)
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
            setup?.(item, _data)
        },
        deleteSystem
    ]
}

const noData = <GameObject extends object | Appendable>({
    setup,
    cleanup,
    update,
    ticker
}: Options<GameObject, void>) => {
    const queued = new Set<GameObject>()

    const execute = () => {
        for (const target of queued) update!(target)
    }

    let handle: Cancellable | undefined
    const onEvent = mapTicker(ticker ?? "beforeRender")
    const start = update ? () => (handle = onEvent(execute)) : () => {}

    const deleteSystem = (item: GameObject) => {
        if (!queued.delete(item)) return
        "$deleteSystemSet" in item && item.$deleteSystemSet.delete(deleteSystem)
        queued.size === 0 && handle?.cancel()
        cleanup?.(item)
    }
    return <const>[
        (item: GameObject) => {
            if (queued.has(item)) return
            queued.add(item)
            "$deleteSystemSet" in item &&
                item.$deleteSystemSet.add(deleteSystem)
            queued.size === 1 && start()
            setup?.(item)
        },
        deleteSystem
    ]
}
