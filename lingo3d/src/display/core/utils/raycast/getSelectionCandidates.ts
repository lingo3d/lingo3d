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
import {
    unselectableSet,
    selectionCandidates,
    overrideSelectionCandidates
} from "../../../../collections/selectionCollections"

const traverse = (
    targets: Array<Appendable | VisibleMixin> | Set<Appendable | VisibleMixin>,
    frozenSet: Set<Appendable>
) => {
    for (const manager of targets)
        if (
            !frozenSet.has(manager) &&
            "addToRaycastSet" in manager &&
            !unselectableSet.has(manager)
        ) {
            manager.addToRaycastSet(selectionCandidates)
            manager.children && traverse(manager.children, frozenSet)
        }
}

export const getSelectionCandidates = throttleTrailing(
    (targets: Array<Appendable> | Set<Appendable> = appendableRoot) => {
        selectionCandidates.clear()
        const selectionFocus = getSelectionFocus()
        if (selectionFocus) {
            if (selectionFocus instanceof MeshAppendable)
                selectionFocus.outerObject3d.traverse(
                    (child: Object3D | StandardMesh) =>
                        "material" in child &&
                        child.material.userData.TextureManager &&
                        selectionCandidates.add(child)
                )
            return
        }
        if (overrideSelectionCandidates.size) {
            for (const candidate of overrideSelectionCandidates)
                selectionCandidates.add(candidate)
            return
        }
        const [frozenSet] = getSelectionFrozen()
        traverse(targets, frozenSet)
    }
)

getSelectionFrozen(() => {
    getSelectionCandidates()
    emitSelectionTarget(undefined)
})
