import { serializeAppendable } from "../../api/serializer/serialize"
import { pushUndoStack } from "../../api/undoStack"
import { multipleSelectionTargets } from "../../collections/multipleSelectionTargets"
import Group from "../../display/Group"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { multipleSelectionGroupPtr } from "../../pointers/multipleSelectionGroupPtr"

export default () => {
    const [group] = multipleSelectionGroupPtr
    if (!group) return
    const consolidatedGroup = new Group()
    consolidatedGroup.position.copy(group.position)
    for (const target of multipleSelectionTargets)
        consolidatedGroup.attach(target)
    emitSelectionTarget(consolidatedGroup)

    pushUndoStack({
        [consolidatedGroup.uuid]: {
            command: "group",
            ...serializeAppendable(consolidatedGroup, false, true),
            children: [...multipleSelectionTargets].map((child) => child.uuid)
        }
    })
}
