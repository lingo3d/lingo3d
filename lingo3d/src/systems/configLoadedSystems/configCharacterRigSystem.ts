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
import { forceGet, omit } from "@lincode/utils"
import { AppendableNode } from "../../api/serializer/types"
import nonSerializedProperties from "../../api/serializer/nonSerializedProperties"

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
            forceGet(self.jointMap, name, () => {
                const joint = new CharacterRigJoint()
                joint.uuid = self.uuid + "." + name
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
    for (const joint of joints) joint.$attachBone()
}

const assignSerializedProperties = (children: Array<AppendableNode>) => {
    for (const child of children) {
        const joint = uuidMapAssertGet(child.uuid!)
        Object.assign(joint, omit(child, nonSerializedProperties))
        child.children && assignSerializedProperties(child.children)
    }
}

export const configCharacterRigSystem = createLoadedEffectSystem(
    "configCharacterRigSystem",
    {
        effect: (self: CharacterRig) => {
            const model = self.model!
            const position = model.position.clone()
            const quaternion = model.quaternion.clone()
            model.position.set(0, 0, 0)
            model.quaternion.set(0, 0, 0, 1)
            self.position.set(0, 0, 0)
            self.quaternion.set(0, 0, 0, 1)

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
                ["head", "neck", "spine2", "spine1", "spine0", "hips"],
                self,
                true
            )
            self.position.copy(position)
            self.quaternion.copy(quaternion)
            self.$jointNodes && assignSerializedProperties(self.$jointNodes)
        },
        cleanup: (self) => {
            for (const joint of self.jointMap.values()) joint.dispose()
            self.jointMap.clear()
            self.model!.src = self.model!.src
        },
        loading: (self) => {
            if (!self.target) return true
            const model = uuidMap.get(self.target)
            if (!(model instanceof Model)) return true
            if (!model.$loadedObject) return true
            self.model = model
            return false
        }
    }
)
