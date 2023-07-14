import CharacterRig from "../display/CharacterRig"
import CharacterRigJoint from "../display/CharacterRigJoint"
import FoundManager from "../display/core/FoundManager"
import direction3d from "../math/direction3d"
import getWorldPosition from "../memo/getWorldPosition"
import createInternalSystem from "./utils/createInternalSystem"

const setDirection = (
    parentDst: CharacterRigJoint,
    parentSrc: FoundManager,
    childSrc: FoundManager
) =>
    parentDst.setRotationFromDirection(
        direction3d(
            getWorldPosition(childSrc.$object),
            getWorldPosition(parentSrc.$object)
        )
    )

export const characterRigAnimationSystem = createInternalSystem(
    "characterRigAnimationSystem",
    {
        data: {} as {
            leftHandSrc: FoundManager
            leftForeArmSrc: FoundManager
            leftArmSrc: FoundManager
            leftShoulderSrc: FoundManager

            leftHandDst: CharacterRigJoint
            leftForeArmDst: CharacterRigJoint
            leftArmDst: CharacterRigJoint
            leftShoulderDst: CharacterRigJoint

            rightHandSrc: FoundManager
            rightForeArmSrc: FoundManager
            rightArmSrc: FoundManager
            rightShoulderSrc: FoundManager

            rightHandDst: CharacterRigJoint
            rightForeArmDst: CharacterRigJoint
            rightArmDst: CharacterRigJoint
            rightShoulderDst: CharacterRigJoint
        },
        update: (
            _: CharacterRig,
            {
                leftHandSrc,
                leftForeArmSrc,
                leftArmSrc,
                leftShoulderSrc,

                leftHandDst,
                leftForeArmDst,
                leftArmDst,
                leftShoulderDst,

                rightHandSrc,
                rightForeArmSrc,
                rightArmSrc,
                rightShoulderSrc,

                rightHandDst,
                rightForeArmDst,
                rightArmDst,
                rightShoulderDst
            }
        ) => {
            setDirection(leftShoulderDst, leftShoulderSrc, leftArmSrc)
            setDirection(leftArmDst, leftArmSrc, leftForeArmSrc)
            setDirection(leftForeArmDst, leftForeArmSrc, leftHandSrc)

            setDirection(rightShoulderDst, rightShoulderSrc, rightArmSrc)
            setDirection(rightArmDst, rightArmSrc, rightForeArmSrc)
            setDirection(rightForeArmDst, rightForeArmSrc, rightHandSrc)
        }
    }
)
