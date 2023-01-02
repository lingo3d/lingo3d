import store, { add, createEffect, remove, clear } from "@lincode/reactivity"
import PositionedManager, {
    isPositionedManager
} from "../display/core/PositionedManager"
import { onDispose } from "../events/onDispose"

const [setMultipleSelectionTargets, getMultipleSelectionTargets] = store([
    new Set<PositionedManager>()
])
export { getMultipleSelectionTargets }
export const addMultipleSelectionTargets = add(
    setMultipleSelectionTargets,
    getMultipleSelectionTargets
)
export const deleteMultipleSelectionTargets = remove(
    setMultipleSelectionTargets,
    getMultipleSelectionTargets
)
export const clearMultipleSelectionTargets = clear(
    setMultipleSelectionTargets,
    getMultipleSelectionTargets
)

export const multipleSelectionTargetsFlushingPtr = [false]

export const flushMultipleSelectionTargets = async (
    onFlush: (targets: Set<PositionedManager>) => void,
    deselect?: boolean
) => {
    multipleSelectionTargetsFlushingPtr[0] = true

    const [targets] = getMultipleSelectionTargets()
    setMultipleSelectionTargets([new Set()])

    await Promise.resolve()

    onFlush(targets)
    if (deselect) {
        multipleSelectionTargetsFlushingPtr[0] = false
        return
    }
    await Promise.resolve()
    await Promise.resolve()

    setMultipleSelectionTargets([targets])
    multipleSelectionTargetsFlushingPtr[0] = false
}

createEffect(() => {
    const [targets] = getMultipleSelectionTargets()
    if (!targets.size) return

    const handle = onDispose(
        (item) =>
            isPositionedManager(item) &&
            targets.has(item) &&
            deleteMultipleSelectionTargets(item)
    )
    return () => {
        handle.cancel()
    }
}, [getMultipleSelectionTargets])
