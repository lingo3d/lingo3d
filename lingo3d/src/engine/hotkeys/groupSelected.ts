import root from "../../api/root"
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

    const commandChildren: Array<string> = []
    const commandParents: Array<string> = []
    for (const target of multipleSelectionTargets) {
        commandChildren.push(target.uuid)
        commandParents.push((target.parent ?? root).uuid)
        consolidatedGroup.attach(target)
    }
    emitSelectionTarget(consolidatedGroup)

    pushUndoStack({
        [consolidatedGroup.uuid]: {
            command: "group",
            ...serializeAppendable(consolidatedGroup, false, true),
            commandChildren,
            commandParents
        }
    })
}
