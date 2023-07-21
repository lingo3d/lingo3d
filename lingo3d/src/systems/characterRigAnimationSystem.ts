import { Vector3 } from "three"
import CharacterRig from "../display/CharacterRig"
import CharacterRigJoint from "../display/CharacterRigJoint"
import FoundManager from "../display/core/FoundManager"
import { quaternion_, quaternion__, vector3 } from "../display/utils/reusables"
import direction3d from "../math/direction3d"
import getWorldPosition from "../memo/getWorldPosition"
import createInternalSystem from "./utils/createInternalSystem"

const setDirection = (
    parentPair: [FoundManager | undefined, CharacterRigJoint | undefined],
    childPair: [FoundManager | undefined, CharacterRigJoint | undefined]
) => {
    if (!parentPair[0] || !parentPair[1] || !childPair[0] || !childPair[1])
        return
    quaternion_.copy(parentPair[1].quaternion)
    parentPair[1].setRotationFromDirection(
        direction3d(
            getWorldPosition(childPair[0].$object),
            getWorldPosition(parentPair[0].$object)
        )
    )
    quaternion__.copy(parentPair[1].quaternion)
    parentPair[1].quaternion.copy(quaternion_).slerp(quaternion__, 0.5)
}

export const characterRigAnimationSystem = createInternalSystem(
    "characterRigAnimationSystem",
    {
        data: {} as {
            leftHand: [FoundManager | undefined, CharacterRigJoint | undefined]
            leftForeArm: [
                FoundManager | undefined,
                CharacterRigJoint | undefined
            ]
            leftArm: [FoundManager | undefined, CharacterRigJoint | undefined]
            leftShoulder: [
                FoundManager | undefined,
                CharacterRigJoint | undefined
            ]

            rightHand: [FoundManager | undefined, CharacterRigJoint | undefined]
            rightForeArm: [
                FoundManager | undefined,
                CharacterRigJoint | undefined
            ]
            rightArm: [FoundManager | undefined, CharacterRigJoint | undefined]
            rightShoulder: [
                FoundManager | undefined,
                CharacterRigJoint | undefined
            ]

            leftForeFoot: [
                FoundManager | undefined,
                CharacterRigJoint | undefined
            ]
            leftFoot: [FoundManager | undefined, CharacterRigJoint | undefined]
            leftLeg: [FoundManager | undefined, CharacterRigJoint | undefined]
            leftThigh: [FoundManager | undefined, CharacterRigJoint | undefined]

            rightForeFoot: [
                FoundManager | undefined,
                CharacterRigJoint | undefined
            ]
            rightFoot: [FoundManager | undefined, CharacterRigJoint | undefined]
            rightLeg: [FoundManager | undefined, CharacterRigJoint | undefined]
            rightThigh: [
                FoundManager | undefined,
                CharacterRigJoint | undefined
            ]

            head: [FoundManager | undefined, CharacterRigJoint | undefined]
            neck: [FoundManager | undefined, CharacterRigJoint | undefined]
            spine2: [FoundManager | undefined, CharacterRigJoint | undefined]
            spine1: [FoundManager | undefined, CharacterRigJoint | undefined]
            spine0: [FoundManager | undefined, CharacterRigJoint | undefined]
            hips: [FoundManager | undefined, CharacterRigJoint | undefined]

            hipsPositionSrc: Vector3
            hipsPositionDst?: Vector3
        },
        update: (
            _: CharacterRig,
            {
                leftHand,
                leftForeArm,
                leftArm,
                leftShoulder,

                rightHand,
                rightForeArm,
                rightArm,
                rightShoulder,

                leftForeFoot,
                leftFoot,
                leftLeg,
                leftThigh,

                rightForeFoot,
                rightFoot,
                rightLeg,
                rightThigh,

                head,
                neck,
                spine2,
                spine1,
                spine0,
                hips,

                hipsPositionSrc,
                hipsPositionDst
            }
        ) => {
            setDirection(leftShoulder, leftArm)
            setDirection(leftArm, leftForeArm)
            setDirection(leftForeArm, leftHand)

            setDirection(rightShoulder, rightArm)
            setDirection(rightArm, rightForeArm)
            setDirection(rightForeArm, rightHand)

            setDirection(leftThigh, leftLeg)
            setDirection(leftLeg, leftFoot)
            setDirection(leftFoot, leftForeFoot)

            setDirection(rightThigh, rightLeg)
            setDirection(rightLeg, rightFoot)
            setDirection(rightFoot, rightForeFoot)

            setDirection(head, neck)
            setDirection(neck, spine2)
            setDirection(spine2, spine1)
            setDirection(spine1, spine0)
            setDirection(spine0, hips)

            if (hips[1] && hips[0])
                hips[1].position
                    .copy(hipsPositionDst!)
                    .add(
                        vector3
                            .copy(hips[0].position)
                            .sub(hipsPositionSrc)
                            .multiplyScalar(hips[0].owner.resizeScale)
                    )
        }
    }
)
