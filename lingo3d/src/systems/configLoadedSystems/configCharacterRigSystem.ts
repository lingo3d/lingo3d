import { uuidMap, uuidMapAssertGet } from "../../collections/idCollections"
import CharacterRig from "../../display/CharacterRig"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"
import CharacterRigJoint from "../../display/CharacterRigJoint"
import Model from "../../display/Model"
import { CharacterRigJointName } from "../../interface/ICharacterRig"
import direction3d from "../../math/direction3d"
import distance3d from "../../math/distance3d"
import getWorldPosition from "../../memo/getWorldPosition"
import { Point3dType } from "../../typeGuards/isPoint"
import { forceGet } from "@lincode/utils"

const setRotation = (
    parentJoint: CharacterRigJoint,
    childPosition: Point3dType,
    parentPosition: Point3dType,
    flipY?: boolean
) => {
    parentJoint.setRotationFromDirection(
        flipY
            ? direction3d(parentPosition, childPosition)
            : direction3d(childPosition, parentPosition)
    )
}

const attachJoints = (
    names: Array<CharacterRigJointName>,
    self: CharacterRig,
    isSpine?: boolean
) => {
    const joints = names
        .filter((name) => self[name])
        .map((name) =>
            forceGet(self.$jointMap, name, () => {
                const joint = new CharacterRigJoint()
                self.append(joint)
                joint.characterRig = self
                joint.target = joint.name = name
                return joint
            })
        )
    let childJoint: CharacterRigJoint | undefined
    const lastJoint = joints.at(-1)
    for (const parentJoint of joints) {
        if (!childJoint) {
            if (!isSpine) {
                const { $object } = parentJoint.boneManager
                const child = $object.children
                    .map(
                        (c) =>
                            <const>[
                                distance3d(
                                    getWorldPosition($object),
                                    getWorldPosition(c)
                                ),
                                c
                            ]
                    )
                    .sort((a, b) => b[0] - a[0])[0]?.[1]
                child &&
                    setRotation(
                        parentJoint,
                        getWorldPosition(child),
                        getWorldPosition(parentJoint.$object),
                        isSpine
                    )
            }
            childJoint = parentJoint
            continue
        }
        if (isSpine || parentJoint !== lastJoint)
            setRotation(
                parentJoint,
                getWorldPosition(childJoint.$object),
                getWorldPosition(parentJoint.$object),
                isSpine
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
            attachJoints(
                [
                    "leftHand",
                    "leftForeArm",
                    "leftArm",
                    "leftShoulder",
                    "spine2"
                ],
                self
            )
            attachJoints(
                [
                    "rightHand",
                    "rightForeArm",
                    "rightArm",
                    "rightShoulder",
                    "spine2"
                ],
                self
            )
            attachJoints(
                ["leftForeFoot", "leftFoot", "leftLeg", "leftThigh", "hips"],
                self
            )
            attachJoints(
                [
                    "rightForeFoot",
                    "rightFoot",
                    "rightLeg",
                    "rightThigh",
                    "hips"
                ],
                self
            )
            attachJoints(
                ["neck", "spine2", "spine1", "spine0", "hips"],
                self,
                true
            )
            const { $jointMap } = self
            if ($jointMap.has("leftShoulder"))
                $jointMap.get("leftShoulder")!.innerRotationZ = 90
            if ($jointMap.has("rightShoulder"))
                $jointMap.get("rightShoulder")!.innerRotationZ = -90

            if ($jointMap.has("leftFoot"))
                $jointMap.get("leftFoot")!.innerRotationX = -55
            if ($jointMap.has("rightFoot"))
                $jointMap.get("rightFoot")!.innerRotationX = -55

            if ($jointMap.has("leftForeFoot"))
                $jointMap.get("leftForeFoot")!.innerRotationX = -35
            if ($jointMap.has("rightForeFoot"))
                $jointMap.get("rightForeFoot")!.innerRotationX = -35
        },
        cleanup: (self) => {
            for (const joint of self.$jointMap.values()) joint.dispose()
            self.$jointMap.clear()
            const model = uuidMapAssertGet<Model>(self.target!)
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
