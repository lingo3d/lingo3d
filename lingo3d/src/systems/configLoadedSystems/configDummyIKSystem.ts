import { forceGet, forceGetInstance } from "@lincode/utils"
import { uuidMap } from "../../collections/idCollections"
import DummyIK from "../../display/DummyIK"
import IDummyIK from "../../interface/IDummyIK"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"
import Sphere from "../../display/primitives/Sphere"
import { getDummyIK } from "../../states/useDummyIK"
import FoundManager from "../../display/core/FoundManager"
import Cube from "../../display/primitives/Cube"
import { vector3 } from "../../display/utils/reusables"
import MeshAppendable from "../../display/core/MeshAppendable"
import { Point3dType } from "../../utils/isPoint"

type JointName = keyof IDummyIK

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

const nameJointMap = new Map<JointName, Sphere>()
getDummyIK(() => nameJointMap.clear())

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

        const joint = new Sphere()
        joint.name = name
        joint.scale = 0.05
        joint.depthTest = false
        joint.placeAt(found.getWorldPosition())
        joint.opacity = 0.5

        const jointDest = new Cube()
        joint.append(jointDest)
        jointDest.y = -150
        jointDest.scale = 0.2
        jointDest.depthTest = false
        jointDest.opacity = 0.5

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
        joint.attach(found)
        return joint
    })
}

export const configDummyIKSystem = createLoadedEffectSystem(
    "configDummyIKSystem",
    {
        effect: (self: DummyIK) => {
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
            if (!self.target) return false
            const dummy = uuidMap.get(self.target)
            return (
                !!dummy && "$loadedObject3d" in dummy && !dummy.$loadedObject3d
            )
        }
    }
)
