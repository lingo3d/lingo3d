import { Cancellable } from "@lincode/promiselikes"
import { debounceTrailing } from "@lincode/utils"
import { Object3D } from "three"
import StaticObjectManager from ".."
import Appendable, { appendableRoot } from "../../../../api/core/Appendable"
import {
    onSelectionTarget,
    emitSelectionTarget
} from "../../../../events/onSelectionTarget"
import { getSelectionFocus } from "../../../../states/useSelectionFocus"
import { getSelectionFrozen } from "../../../../states/useSelectionFrozen"
import VisibleObjectManager from "../../VisibleObjectManager"

const selectionCandidates = new Set<Object3D>()
export default selectionCandidates

export const unselectableSet = new WeakSet<StaticObjectManager>()
export const manualSelectionCandidates = new Set<Object3D>()

export const addSelectionHelper = (
    helper: VisibleObjectManager,
    manager: Appendable
) => {
    appendableRoot.delete(helper)
    manager.outerObject3d.add(helper.outerObject3d)
    manualSelectionCandidates.add(helper.nativeObject3d)

    helper.castShadow = false
    helper.receiveShadow = false

    const handle = onSelectionTarget(
        ({ target }) => target === helper && emitSelectionTarget(manager)
    )
    return new Cancellable(() => {
        helper.dispose()
        manualSelectionCandidates.delete(helper.nativeObject3d)
        handle.cancel()
    })
}

const traverse = (
    targets:
        | Array<Appendable | StaticObjectManager>
        | Set<Appendable | StaticObjectManager>,
    frozenSet: Set<Appendable>,
    focusSet: WeakSet<Appendable> | undefined
) => {
    for (const manager of targets) {
        if (frozenSet.has(manager) || (focusSet && !focusSet.has(manager)))
            continue

        if ("addToRaycastSet" in manager && !unselectableSet.has(manager))
            //@ts-ignore
            manager.addToRaycastSet(selectionCandidates)

        manager.children && traverse(manager.children, frozenSet, focusSet)
    }
}

export const getSelectionCandidates = debounceTrailing(
    (targets: Array<Appendable> | Set<Appendable> = appendableRoot) => {
        const [frozenSet] = getSelectionFrozen()
        const focusSet = getSelectionFocus()
        selectionCandidates.clear()
        traverse(targets, frozenSet, focusSet)
        for (const candidate of manualSelectionCandidates)
            selectionCandidates.add(candidate)
    },
    300
)

getSelectionFrozen(() => {
    getSelectionCandidates()
    emitSelectionTarget()
})

getSelectionFocus(() => {
    getSelectionCandidates()
    emitSelectionTarget()
})
