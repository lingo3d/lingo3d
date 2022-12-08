import store, { pull, push, reset } from "@lincode/reactivity"
import PositionedItem from "../api/core/PositionedItem"

export const [setMultipleSelectionTargets, getMultipleSelectionTargets] = store<
    Array<PositionedItem>
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

export const flushMultipleSelectionTargets = async (onFlush: () => void) => {
    multipleSelectionTargetsFlushingPtr[0] = true

    const targets = getMultipleSelectionTargets()
    setMultipleSelectionTargets([])

    await Promise.resolve()

    onFlush()

    await Promise.resolve()
    await Promise.resolve()

    setMultipleSelectionTargets(targets)

    multipleSelectionTargetsFlushingPtr[0] = false
}
