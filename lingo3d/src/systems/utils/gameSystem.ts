import { Cancellable } from "@lincode/promiselikes"
import Appendable from "../../display/core/Appendable"
import { onBeforeRender } from "../../runtime"

type Options<
    GameObject extends Appendable,
    Data extends Record<string, any> | void
> = {
    data?: Data | (() => Data)
    setup?: (gameObject: GameObject, data: Data) => void
    cleanup?: (gameObject: GameObject, data: Data) => void
    update?: (gameObject: GameObject, data: Data) => void
}

export default <
    GameObject extends Appendable,
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
    GameObject extends Appendable,
    Data extends Record<string, any>
>({
    data,
    setup,
    cleanup,
    update
}: Options<GameObject, Data>) => {
    const queued = new Map<GameObject, Data>()

    const execute = () => {
        for (const [target, data] of queued) update!(target, data)
    }

    let handle: Cancellable | undefined
    const start = update ? () => (handle = onBeforeRender(execute)) : () => {}

    const deleteSystem = (item: GameObject) => {
        if (!queued.has(item)) return
        const _data = queued.get(item)!
        queued.delete(item)
        item.$deleteSystemSet.delete(deleteSystem)
        queued.size === 0 && handle?.cancel()
        cleanup?.(item, _data)
    }
    return <const>[
        (item: GameObject) => {
            if (queued.has(item)) return
            const _data = typeof data === "function" ? data() : data!
            queued.set(item, _data)
            item.$deleteSystemSet.add(deleteSystem)
            queued.size === 1 && start()
            setup?.(item, _data)
        },
        deleteSystem
    ]
}

const noData = <GameObject extends Appendable>({
    setup,
    cleanup,
    update
}: Options<GameObject, void>) => {
    const queued = new Set<GameObject>()

    const execute = () => {
        for (const target of queued) update!(target)
    }

    let handle: Cancellable | undefined
    const start = update ? () => (handle = onBeforeRender(execute)) : () => {}

    const deleteSystem = (item: GameObject) => {
        if (!queued.delete(item)) return
        item.$deleteSystemSet.delete(deleteSystem)
        queued.size === 0 && handle?.cancel()
        cleanup?.(item)
    }
    return <const>[
        (item: GameObject) => {
            if (queued.has(item)) return
            queued.add(item)
            item.$deleteSystemSet.add(deleteSystem)
            queued.size === 1 && start()
            setup?.(item)
        },
        deleteSystem
    ]
}
