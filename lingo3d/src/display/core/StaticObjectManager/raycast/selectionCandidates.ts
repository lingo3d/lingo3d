import { Cancellable } from "@lincode/promiselikes"
import { debounce } from "@lincode/utils"
import { Object3D } from "three"
import StaticObjectManager from ".."
import Appendable, { appendableRoot } from "../../../../api/core/Appendable"
import {
    onSelectionTarget,
    emitSelectionTarget
} from "../../../../events/onSelectionTarget"
import { getSelectionFrozen } from "../../../../states/useSelectionFrozen"

const selectionCandidates = new Set<Object3D>()
export default selectionCandidates

export const unselectableSet = new WeakSet<StaticObjectManager>()
const helpers = new Set<StaticObjectManager>()

export const addSelectionHelper = (
    helper: StaticObjectManager,
    manager: Appendable
) => {
    appendableRoot.delete(helper)
    manager.outerObject3d.add(helper.outerObject3d)
    helpers.add(helper)

    helper.castShadow = false
    helper.receiveShadow = false

    const handle = onSelectionTarget(
        ({ target }) => target === helper && emitSelectionTarget(manager)
    )
    return new Cancellable(() => {
        helper.dispose()
        helpers.delete(helper)
        handle.cancel()
    })
}

const traverse = (
    targets:
        | Array<Appendable | StaticObjectManager>
        | Set<Appendable | StaticObjectManager>,
    frozenSet: Set<Appendable>
) => {
    for (const helper of helpers) {
        //@ts-ignore
        helper.addToRaycastSet(selectionCandidates)
    }
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
