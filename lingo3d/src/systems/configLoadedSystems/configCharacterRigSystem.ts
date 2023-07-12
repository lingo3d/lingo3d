import { uuidMap } from "../../collections/idCollections"
import CharacterRig from "../../display/CharacterRig"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"
import RigJoint from "../../display/CharacterRig/RigJoint"
import Model from "../../display/Model"
import { CharacterRigJointName } from "../../interface/ICharacterRig"
import direction3d from "../../math/direction3d"
import distance3d from "../../math/distance3d"
import getWorldPosition from "../../memo/getWorldPosition"
import { Point3dType } from "../../typeGuards/isPoint"

const setRotation = (
    parentJoint: RigJoint,
    childPosition: Point3dType,
    parentPosition: Point3dType,
    flipY: boolean
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
    jointMap: Map<CharacterRigJointName, RigJoint>,
    autoEndPoint = true,
    flipY = false
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
            if (autoEndPoint) {
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
                        flipY
                    )
            }
            childJoint = parentJoint
            continue
        }
        setRotation(
            parentJoint,
            getWorldPosition(childJoint.$object),
            getWorldPosition(parentJoint.$object),
            flipY
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
            attachJoints(
                ["leftHand", "leftForeArm", "leftArm", "leftShoulder"],
                self,
                jointMap
            )
            attachJoints(
                ["rightHand", "rightForeArm", "rightArm", "rightShoulder"],
                self,
                jointMap
            )
            attachJoints(
                ["leftForeFoot", "leftFoot", "leftLeg", "leftThigh"],
                self,
                jointMap
            )
            attachJoints(
                ["rightForeFoot", "rightFoot", "rightLeg", "rightThigh"],
                self,
                jointMap
            )
            attachJoints(
                ["neck", "spine2", "spine1", "spine0", "hips"],
                self,
                jointMap,
                false,
                true
            )
            if (jointMap.has("leftShoulder"))
                jointMap.get("leftShoulder")!.innerRotationZ = 90
            if (jointMap.has("rightShoulder"))
                jointMap.get("rightShoulder")!.innerRotationZ = -90

            if (jointMap.has("leftFoot"))
                jointMap.get("leftFoot")!.innerRotationX = -55
            if (jointMap.has("rightFoot"))
                jointMap.get("rightFoot")!.innerRotationX = -55

            if (jointMap.has("leftForeFoot"))
                jointMap.get("leftForeFoot")!.innerRotationX = -35
            if (jointMap.has("rightForeFoot"))
                jointMap.get("rightForeFoot")!.innerRotationX = -35
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
