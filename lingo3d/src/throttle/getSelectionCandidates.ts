import { Object3D } from "three"
import Appendable from "../api/core/Appendable"
import MeshAppendable from "../api/core/MeshAppendable"
import { appendableRoot } from "../collections/appendableRoot"
import { selectionCandidates } from "../collections/selectionCandidates"
import { StandardMesh } from "../display/core/mixins/TexturedStandardMixin"
import VisibleMixin from "../display/core/mixins/VisibleMixin"
import { emitSelectionTarget } from "../events/onSelectionTarget"
import { getSelectionFocus } from "../states/useSelectionFocus"
import { getSelectionFrozen } from "../states/useSelectionFrozen"
import throttleFrameTrailing from "./utils/throttleFrameTrailing"

const traverse = (
    targets: Array<Appendable | VisibleMixin> | Set<Appendable | VisibleMixin>,
    frozenSet: Set<Appendable>
) => {
    for (const manager of targets) {
        if (frozenSet.has(manager) || manager.$disableSelection) continue
        "$addToRaycastSet" in manager &&
            manager.$addToRaycastSet(selectionCandidates)
        manager.children && traverse(manager.children, frozenSet)
    }
}

const traverseFocusChildren = async (
    selectionFocus: MeshAppendable,
    frozenSet: Set<Appendable>
) => {
    const { getFoundManager } = await import("../api/utils/getFoundManager")
    selectionFocus.outerObject3d.traverse((child: Object3D | StandardMesh) => {
        if (
            child === selectionFocus.outerObject3d ||
            child === selectionFocus.object3d ||
            child.type === "Line"
        )
            return
        const manager = getFoundManager(child, selectionFocus as any)
        if (frozenSet.has(manager) || manager.$disableSelection) return
        manager.$addToRaycastSet(selectionCandidates)
    })
}

export const getSelectionCandidates = throttleFrameTrailing(
    (targets: Array<Appendable> | Set<Appendable> = appendableRoot) => {
        selectionCandidates.clear()
        const [frozenSet] = getSelectionFrozen()
        const selectionFocus = getSelectionFocus()
        if (selectionFocus)
            selectionFocus instanceof MeshAppendable &&
                traverseFocusChildren(selectionFocus, frozenSet)
        else traverse(targets, frozenSet)
    }
)

getSelectionFrozen(() => {
    getSelectionCandidates()
    emitSelectionTarget(undefined)
})
