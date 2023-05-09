import { throttleTrailing } from "@lincode/utils"
import { Object3D } from "three"
import Appendable from "../../../../api/core/Appendable"
import MeshAppendable from "../../../../api/core/MeshAppendable"
import { emitSelectionTarget } from "../../../../events/onSelectionTarget"
import { getSelectionFocus } from "../../../../states/useSelectionFocus"
import { getSelectionFrozen } from "../../../../states/useSelectionFrozen"
import { StandardMesh } from "../../mixins/TexturedStandardMixin"
import VisibleMixin from "../../mixins/VisibleMixin"
import { appendableRoot } from "../../../../collections/appendableRoot"
import { selectionCandidates } from "../../../../collections/selectionCandidates"
import { disableSelection } from "../../../../collections/disableSelection"

const traverse = (
    targets: Array<Appendable | VisibleMixin> | Set<Appendable | VisibleMixin>,
    frozenSet: Set<Appendable>
) => {
    for (const manager of targets) {
        if (frozenSet.has(manager) || disableSelection.has(manager))
            continue
        "$addToRaycastSet" in manager &&
            manager.$addToRaycastSet(selectionCandidates)
        manager.children && traverse(manager.children, frozenSet)
    }
}

const traverseNative = async (
    selectionFocus: MeshAppendable,
    frozenSet: Set<Appendable>
) => {
    const { getFoundManager } = await import(
        "../../../../api/utils/getFoundManager"
    )
    selectionFocus.outerObject3d.traverse((child: Object3D | StandardMesh) => {
        if (
            child === selectionFocus.outerObject3d ||
            child === selectionFocus.object3d
        )
            return
        const manager = getFoundManager(child, selectionFocus as any)
        if (frozenSet.has(manager) || disableSelection.has(manager)) return
        manager.$addToRaycastSet(selectionCandidates)
    })
}

export const getSelectionCandidates = throttleTrailing(
    (targets: Array<Appendable> | Set<Appendable> = appendableRoot) => {
        selectionCandidates.clear()
        const [frozenSet] = getSelectionFrozen()
        const selectionFocus = getSelectionFocus()
        if (selectionFocus) {
            selectionFocus instanceof MeshAppendable &&
                traverseNative(selectionFocus, frozenSet)
            return
        }
        traverse(targets, frozenSet)
    }
)

getSelectionFrozen(() => {
    getSelectionCandidates()
    emitSelectionTarget(undefined)
})
