import { forceGet, forceGetInstance } from "@lincode/utils"
import { uuidMap } from "../../collections/idCollections"
import CharacterRig from "../../display/CharacterRig"
import ICharacterRig from "../../interface/ICharacterRig"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"
import { getCharacterRig } from "../../states/useCharacterRig"
import FoundManager from "../../display/core/FoundManager"
import { vector3 } from "../../display/utils/reusables"
import MeshAppendable from "../../display/core/MeshAppendable"
import { Point3dType } from "../../utils/isPoint"
import CharacterRigJoint from "../../display/CharacterRigJoint"

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

const nameJointMap = new Map<JointName, CharacterRigJoint>()
getCharacterRig(() => nameJointMap.clear())

const getDirection = (fromPoint: Point3dType, toPoint: Point3dType) =>
    vector3
        .copy(toPoint as any)
        .sub(fromPoint as any)
        .normalize()

function rotateJoint(target: MeshAppendable, joint: MeshAppendable) {
    joint.setRotationFromDirection(getDirection(target, joint))
}

const getJoint = (name: JointName, uuid: string | undefined) => {
    if (!uuid) return
    return forceGet(nameJointMap, name, () => {
        const found = uuidMap.get(uuid) as FoundManager
        found.$unghost()

        const joint = new CharacterRigJoint()
        joint.$ghost()
        joint.name = name
        joint.placeAt(found.getWorldPosition())

        const childNames = parentChildrenNameMap.get(name) ?? []
        for (const childName of childNames) {
            const child = nameJointMap.get(childName)
            if (!child) continue
            if (childNames.length === 1) rotateJoint(child, joint)
            joint.attach(child)
        }
        const parentName = childParentNameMap.get(name)
        const parent = parentName && nameJointMap.get(parentName)
        if (parent) {
            parentChildrenNameMap.get(parentName)?.length === 1 &&
                rotateJoint(joint, parent)
            parent.attach(joint)
        }
        joint.outerObject3d.attach(found.outerObject3d)
        return joint
    })
}

export const configCharacterRigSystem = createLoadedEffectSystem(
    "configCharacterRigSystem",
    {
        effect: (self: CharacterRig) => {
            const { leftHand, leftForeArm, leftArm } = self
            const leftHandJoint = getJoint("leftHand", leftHand)
            const leftForeArmJoint = getJoint("leftForeArm", leftForeArm)
            const leftArmJoint = getJoint("leftArm", leftArm)

            if (leftHandJoint && leftForeArmJoint && leftArmJoint) {
                leftForeArmJoint.quaternion.set(0, 0, 0, 1)
                leftArmJoint.quaternion.set(0, 0, 0, 1)
                leftArmJoint.rotationZ = 90
            }
        },
        loading: (self) => {
            if (!self.target) return true
            const model = uuidMap.get(self.target)
            if (!model) return true
            return "$loadedObject3d" in model && !model.$loadedObject3d
        }
    }
)
