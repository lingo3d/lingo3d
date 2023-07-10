import { uuidMap } from "../../collections/idCollections"
import CharacterRig from "../../display/CharacterRig"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"
import RigJoint from "../../display/CharacterRig/RigJoint"
import Model from "../../display/Model"
import { CharacterRigJointName } from "../../interface/ICharacterRig"
import direction3d from "../../math/direction3d"

const attachJoints = (
    names: Array<CharacterRigJointName>,
    self: CharacterRig,
    jointMap: Map<CharacterRigJointName, RigJoint>
) => {
    const joints = names
        .filter((name) => self[name])
        .map((name) => {
            const joint = new RigJoint(self, name)
            jointMap.set(name, joint)
            return joint
        })
    let childJoint: RigJoint | undefined
    for (const parentJoint of joints) {
        if (!childJoint) {
            childJoint = parentJoint
            continue
        }
        parentJoint.setRotationFromDirection(
            direction3d(childJoint, parentJoint)
        )
        parentJoint.attach(childJoint)
        childJoint = parentJoint
    }
    for (const joint of joints) {
        joint.$attachBone()
        joint.quaternion.set(0, 0, 0, 1)
    }
}

export const configCharacterRigSystem = createLoadedEffectSystem(
    "configCharacterRigSystem",
    {
        effect: (self: CharacterRig) => {
            const jointMap = new Map<CharacterRigJointName, RigJoint>()
            attachJoints(["leftHand", "leftForeArm", "leftArm"], self, jointMap)
            attachJoints(
                ["rightHand", "rightForeArm", "rightArm"],
                self,
                jointMap
            )
            if (jointMap.has("leftArm"))
                jointMap.get("leftArm")!.innerRotationZ = 90
            if (jointMap.has("rightArm"))
                jointMap.get("rightArm")!.innerRotationZ = -90
        },
        cleanup: (self) => {
            for (const child of self.children ?? [])
                child instanceof RigJoint && child.dispose()
            const model = uuidMap.get(self.target!)
            if (!(model instanceof Model)) return
            model.src = model.src
        },
        loading: (self) => {
            if (!self.target) return true
            const model = uuidMap.get(self.target)
            if (!model) return true
            return "$loadedObject" in model && !model.$loadedObject
        }
    }
)
