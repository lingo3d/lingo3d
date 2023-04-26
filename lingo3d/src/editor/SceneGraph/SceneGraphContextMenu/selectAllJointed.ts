import { jointSet } from "../../../collections/jointSet"
import PhysicsObjectManager from "../../../display/core/PhysicsObjectManager"
import { addMultipleSelectionTargets } from "../../../states/useMultipleSelectionTargets"

const findAllJointed = (
    target: PhysicsObjectManager,
    jointedSet = new Set<PhysicsObjectManager>(),
    jointsCopy = new Set(jointSet)
) => {
    jointedSet.add(target)
    for (const joint of jointsCopy)
        if (joint.$fromManager === target) {
            jointsCopy.delete(joint)
            addMultipleSelectionTargets(joint)
            if (joint.$toManager) {
                jointedSet.add(joint.$toManager)
                findAllJointed(joint.$toManager, jointedSet, jointsCopy)
            }
        } else if (joint.$toManager === target) {
            jointsCopy.delete(joint)
            addMultipleSelectionTargets(joint)
            if (joint.$fromManager) {
                jointedSet.add(joint.$fromManager)
                findAllJointed(joint.$fromManager, jointedSet, jointsCopy)
            }
        }
    return jointedSet
}

export default (target?: PhysicsObjectManager) => {
    if (!target) return
    for (const manager of findAllJointed(target))
        addMultipleSelectionTargets(manager)
}
