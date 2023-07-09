import { forceGetInstance } from "@lincode/utils"
import { uuidMap } from "../../collections/idCollections"
import CharacterRig from "../../display/CharacterRig"
import ICharacterRig from "../../interface/ICharacterRig"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"
import { vector3 } from "../../display/utils/reusables"
import MeshAppendable from "../../display/core/MeshAppendable"
import { Point3dType } from "../../typeGuards/isPoint"
import RigJoint from "../../display/CharacterRig/RigJoint"
import Model from "../../display/Model"

type JointName = keyof ICharacterRig

const parentChildrenNameMap = new Map<JointName, Array<JointName>>()
const childParentNameMap = new Map<JointName, JointName>()
const setParenting = (names: Array<JointName>) => {
    let parentName: JointName | undefined
    for (const childName of names) {
        if (parentName) {
            forceGetInstance(parentChildrenNameMap, parentName, Array).push(
                childName
            )
            childParentNameMap.set(childName, parentName)
        }
        parentName = childName
    }
}
setParenting(["hips", "spine0", "spine1", "spine2", "neck"])
setParenting(["spine2", "leftShoulder", "leftArm", "leftForeArm", "leftHand"])
setParenting([
    "spine2",
    "rightShoulder",
    "rightArm",
    "rightForeArm",
    "rightHand"
])
setParenting(["hips", "leftThigh", "leftLeg", "leftFoot", "leftForeFoot"])
setParenting(["hips", "rightThigh", "rightLeg", "rightFoot", "rightForeFoot"])

const getDirection = (fromPoint: Point3dType, toPoint: Point3dType) =>
    vector3
        .copy(toPoint as any)
        .sub(fromPoint as any)
        .normalize()

const rotateJoint = (target: MeshAppendable, joint: MeshAppendable) =>
    joint.setRotationFromDirection(getDirection(target, joint))

const setupJoint = (child: RigJoint, parent: RigJoint) => {
    rotateJoint(child, parent)
    parent.attach(child)
}

export const configCharacterRigSystem = createLoadedEffectSystem(
    "configCharacterRigSystem",
    {
        effect: (self: CharacterRig) => {
            if (self.leftHand && self.leftForeArm && self.leftArm) {
                const leftHandJoint = new RigJoint(self, "leftHand")
                const leftForeArmJoint = new RigJoint(self, "leftForeArm")
                const leftArmJoint = new RigJoint(self, "leftArm")

                setupJoint(leftHandJoint, leftForeArmJoint)
                setupJoint(leftForeArmJoint, leftArmJoint)

                leftHandJoint.finalize()
                leftForeArmJoint.finalize()
                leftArmJoint.finalize()

                leftForeArmJoint.quaternion.set(0, 0, 0, 1)
                leftArmJoint.quaternion.set(0, 0, 0, 1)
                leftArmJoint.innerRotationZ = 90
            }
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
