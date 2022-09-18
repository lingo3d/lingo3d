import { debounce } from "@lincode/utils"
import { Object3D } from "three"
import StaticObjectManager from ".."
import Appendable, { appendableRoot } from "../../../../api/core/Appendable"
import { getSelectionFrozen } from "../../../../states/useSelectionFrozen"

const selectionCandidates = new Set<Object3D>()
export default selectionCandidates

export const unselectableSet = new WeakSet<Appendable>()

const traverse = (
    targets:
        | Array<Appendable | StaticObjectManager>
        | Set<Appendable | StaticObjectManager>,
    frozenSet: Set<Appendable>
) => {
    for (const manager of targets) {
        if (frozenSet.has(manager)) continue

        if ("addToRaycastSet" in manager && !unselectableSet.has(manager))
            //@ts-ignore
            manager.addToRaycastSet(selectionCandidates)

        manager.children && traverse(manager.children, frozenSet)
    }
}

export const getSelectionCandidates = debounce(
    (targets: Array<Appendable> | Set<Appendable> = appendableRoot) => {
        const [frozenSet] = getSelectionFrozen()
        selectionCandidates.clear()
        traverse(targets, frozenSet)
    },
    0,
    "trailing"
)
