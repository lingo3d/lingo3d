import { Cancellable } from "@lincode/promiselikes"
import { debounceTrailing } from "@lincode/utils"
import { Object3D } from "three"
import StaticObjectManager from ".."
import Appendable from "../../../../api/core/Appendable"
import { appendableRoot } from "../../../../api/core/collections"
import {
    onSelectionTarget,
    emitSelectionTarget
} from "../../../../events/onSelectionTarget"
import { getSelectionFrozen } from "../../../../states/useSelectionFrozen"
import callPrivateMethod from "../../../../utils/callPrivateMethod"
import VisibleObjectManager from "../../VisibleObjectManager"

const selectionCandidates = new Set<Object3D>()
export default selectionCandidates

export const unselectableSet = new WeakSet<StaticObjectManager>()
export const additionalSelectionCandidates = new Set<Object3D>()
export const overrideSelectionCandidates = new Set<Object3D>()

export const addSelectionHelper = (
    helper: VisibleObjectManager,
    manager: Appendable
) => {
    manager.outerObject3d.add(helper.outerObject3d)
    additionalSelectionCandidates.add(helper.nativeObject3d)

    const handle = onSelectionTarget(
        ({ target }) => target === helper && emitSelectionTarget(manager)
    )
    return new Cancellable(() => {
        helper.dispose()
        additionalSelectionCandidates.delete(helper.nativeObject3d)
        handle.cancel()
    })
}

const traverse = (
    targets:
        | Array<Appendable | StaticObjectManager>
        | Set<Appendable | StaticObjectManager>,
    frozenSet: Set<Appendable>
) => {
    for (const manager of targets) {
        if (frozenSet.has(manager)) continue

        if ("addToRaycastSet" in manager && !unselectableSet.has(manager))
            callPrivateMethod(manager, "addToRaycastSet", selectionCandidates)

        manager.children && traverse(manager.children, frozenSet)
    }
}

export const getSelectionCandidates = debounceTrailing(
    (targets: Array<Appendable> | Set<Appendable> = appendableRoot) => {
        selectionCandidates.clear()
        if (overrideSelectionCandidates.size) {
            for (const candidate of overrideSelectionCandidates)
                selectionCandidates.add(candidate)
            return
        }
        const [frozenSet] = getSelectionFrozen()
        traverse(targets, frozenSet)
        for (const candidate of additionalSelectionCandidates)
            selectionCandidates.add(candidate)
    }
)

getSelectionFrozen(() => {
    getSelectionCandidates()
    emitSelectionTarget(undefined)
})
