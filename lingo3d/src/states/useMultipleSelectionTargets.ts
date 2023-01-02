import store, { createEffect, pull, push, reset } from "@lincode/reactivity"
import PositionedManager, {
    isPositionedManager
} from "../display/core/PositionedManager"
import { onDispose } from "../events/onDispose"

export const [setMultipleSelectionTargets, getMultipleSelectionTargets] = store<
    Array<PositionedManager>
>([])

export const pushMultipleSelectionTargets = push(
    setMultipleSelectionTargets,
    getMultipleSelectionTargets
)
export const pullMultipleSelectionTargets = pull(
    setMultipleSelectionTargets,
    getMultipleSelectionTargets
)
export const resetMultipleSelectionTargets = reset(
    setMultipleSelectionTargets,
    getMultipleSelectionTargets
)

export const multipleSelectionTargetsFlushingPtr = [false]

export const flushMultipleSelectionTargets = async (
    onFlush: (targets: Array<PositionedManager>) => void,
    deselect?: boolean
) => {
    multipleSelectionTargetsFlushingPtr[0] = true

    const targets = getMultipleSelectionTargets()
    setMultipleSelectionTargets([])

    await Promise.resolve()

    onFlush(targets)
    if (deselect) return

    await Promise.resolve()
    await Promise.resolve()

    setMultipleSelectionTargets(targets)

    multipleSelectionTargetsFlushingPtr[0] = false
}

createEffect(() => {
    const targets = getMultipleSelectionTargets()
    if (!targets.length) return

    const handle = onDispose(
        (item) =>
            isPositionedManager(item) &&
            targets.includes(item) &&
            pullMultipleSelectionTargets(item)
    )
    return () => {
        handle.cancel()
    }
}, [getMultipleSelectionTargets])
