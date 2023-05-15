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

    const childs: Array<string> = []
    const parents: Array<string> = []
    for (const target of multipleSelectionTargets) {
        childs.push(target.uuid)
        parents.push((target.parent ?? root).uuid)
        consolidatedGroup.attach(target)
    }
    emitSelectionTarget(consolidatedGroup)

    pushUndoStack({
        [consolidatedGroup.uuid]: {
            command: "group",
            ...serializeAppendable(consolidatedGroup, false, true),
            childs,
            parents
        }
    })
}
