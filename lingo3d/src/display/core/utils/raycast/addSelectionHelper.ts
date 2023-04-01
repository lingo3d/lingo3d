import { Cancellable } from "@lincode/promiselikes"
import MeshAppendable from "../../../../api/core/MeshAppendable"
import { additionalSelectionCandidates } from "../../../../collections/selectionCollections"
import HelperPrimitive from "../HelperPrimitive"
import HelperSprite from "../HelperSprite"

export const addSelectionHelper = (
    helper: HelperSprite | HelperPrimitive,
    manager: MeshAppendable
) => {
    helper.target = manager
    helper.userData.selectionPointer = manager

    manager.outerObject3d.add(helper.outerObject3d)
    additionalSelectionCandidates.add(helper.object3d)

    return new Cancellable(() => {
        helper.dispose()
        additionalSelectionCandidates.delete(helper.object3d)
    })
}
