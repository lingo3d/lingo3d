import { forceGet, forceGetInstance } from "@lincode/utils"
import { uuidMap } from "../../collections/idCollections"
import DummyIK from "../../display/DummyIK"
import IDummyIK from "../../interface/IDummyIK"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"
import Sphere from "../../display/primitives/Sphere"
import { getDummyIK } from "../../states/useDummyIK"
import FoundManager from "../../display/core/FoundManager"

type JointName = keyof IDummyIK

const parentChildrenMap = new Map<JointName, Array<JointName>>()
const childParentMap = new Map<JointName, JointName>()
const setParenting = (names: Array<JointName>) => {
    let parentName: JointName | undefined
    for (const childName of names) {
        if (parentName) {
            forceGetInstance(parentChildrenMap, parentName, Array).push(
                childName
            )
            childParentMap.set(childName, parentName)
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

const getJoint = (name: JointName, uuid: string | undefined) => {
    uuid &&
        forceGet(nameJointMap, name, () => {
            const manager = uuidMap.get(uuid) as FoundManager
            const joint = new Sphere()
            joint.placeAt(manager)
            return joint
        })
}

export const configDummyIKSystem = createLoadedEffectSystem(
    "configDummyIKSystem",
    {
        effect: (self: DummyIK) => {
            const { leftHand, leftForeArm, leftArm } = self
            getJoint("leftHand", leftHand)
            getJoint("leftForeArm", leftForeArm)
            getJoint("leftArm", leftArm)
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
