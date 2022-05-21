import store, { pull, push, reset } from "@lincode/reactivity"
import type Appendable from "../api/core/Appendable"
import PositionedItem from "../api/core/PositionedItem"

export const [setMultipleSelectionTargets, getMultipleSelectionTargets] = store<Array<PositionedItem>>([])

export const pushMultipleSelectionTargets = push(setMultipleSelectionTargets, getMultipleSelectionTargets)
export const pullMultipleSelectionTargets = pull(setMultipleSelectionTargets, getMultipleSelectionTargets)
export const resetMultipleSelectionTargets = reset(setMultipleSelectionTargets, getMultipleSelectionTargets)

export const multipleSelectionGroupManagers = new WeakSet<Appendable>()