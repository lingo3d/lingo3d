import { uuidMap } from "../../collections/idCollections"
import CharacterRig from "../../display/CharacterRig"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"
import { vector3 } from "../../display/utils/reusables"
import { Point3dType } from "../../typeGuards/isPoint"
import RigJoint from "../../display/CharacterRig/RigJoint"
import Model from "../../display/Model"
import { CharacterRigJointName } from "../../interface/ICharacterRig"

const getDirection = (fromPoint: Point3dType, toPoint: Point3dType) =>
    vector3
        .copy(toPoint as any)
        .sub(fromPoint as any)
        .normalize()

const setupJoint = (childJoint: RigJoint, parentJoint: RigJoint) => {
    parentJoint.setRotationFromDirection(getDirection(childJoint, parentJoint))
    parentJoint.attach(childJoint)
}

const attachJoints = (
    names: Array<CharacterRigJointName>,
    self: CharacterRig,
    jointMap: Map<CharacterRigJointName, RigJoint>
) => {
    const joints = names.map((name) => {
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
        setupJoint(childJoint, parentJoint)
        childJoint = parentJoint
    }
    for (const joint of joints) joint.finalize()
    for (const joint of joints) joint.quaternion.set(0, 0, 0, 1)
}

export const configCharacterRigSystem = createLoadedEffectSystem(
    "configCharacterRigSystem",
    {
        effect: (self: CharacterRig) => {
            const jointMap = new Map<CharacterRigJointName, RigJoint>()
            attachJoints(["leftHand", "leftForeArm", "leftArm"], self, jointMap)
            if (jointMap.has("leftArm"))
                jointMap.get("leftArm")!.innerRotationZ = 90
        },
        cleanup: (self) => {
            for (const child of self.children ?? [])
                child instanceof RigJoint && child.dispose()
            const model = uuidMap.get(self.target!) as Model
            model.src = model.src
        },
        loading: (self) => {
            if (!self.target) return true
            const model = uuidMap.get(self.target)
            if (!model) return true
            return "$loadedObject3d" in model && !model.$loadedObject3d
        }
    }
)
