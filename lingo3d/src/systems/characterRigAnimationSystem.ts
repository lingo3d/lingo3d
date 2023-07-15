import CharacterRig from "../display/CharacterRig"
import CharacterRigJoint from "../display/CharacterRigJoint"
import FoundManager from "../display/core/FoundManager"
import direction3d from "../math/direction3d"
import getWorldPosition from "../memo/getWorldPosition"
import createInternalSystem from "./utils/createInternalSystem"

const setDirection = (
    parentDst: CharacterRigJoint | undefined,
    parentSrc: FoundManager,
    childSrc: FoundManager
) =>
    parentDst?.setRotationFromDirection(
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
            leftHandDst?: CharacterRigJoint
            leftForeArmDst?: CharacterRigJoint
            leftArmDst?: CharacterRigJoint
            leftShoulderDst?: CharacterRigJoint

            rightHandSrc: FoundManager
            rightForeArmSrc: FoundManager
            rightArmSrc: FoundManager
            rightShoulderSrc: FoundManager
            rightHandDst?: CharacterRigJoint
            rightForeArmDst?: CharacterRigJoint
            rightArmDst?: CharacterRigJoint
            rightShoulderDst?: CharacterRigJoint

            leftForeFootSrc: FoundManager
            leftFootSrc: FoundManager
            leftLegSrc: FoundManager
            leftThighSrc: FoundManager
            leftForeFootDst?: CharacterRigJoint
            leftFootDst?: CharacterRigJoint
            leftLegDst?: CharacterRigJoint
            leftThighDst?: CharacterRigJoint

            rightForeFootSrc: FoundManager
            rightFootSrc: FoundManager
            rightLegSrc: FoundManager
            rightThighSrc: FoundManager
            rightForeFootDst?: CharacterRigJoint
            rightFootDst?: CharacterRigJoint
            rightLegDst?: CharacterRigJoint
            rightThighDst?: CharacterRigJoint

            neckSrc: FoundManager
            spine2Src: FoundManager
            spine1Src: FoundManager
            spine0Src: FoundManager
            hipsSrc: FoundManager
            neckDst?: CharacterRigJoint
            spine2Dst?: CharacterRigJoint
            spine1Dst?: CharacterRigJoint
            spine0Dst?: CharacterRigJoint
            hipsDst?: CharacterRigJoint
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
                rightShoulderDst,

                leftForeFootSrc,
                leftFootSrc,
                leftLegSrc,
                leftThighSrc,
                leftForeFootDst,
                leftFootDst,
                leftLegDst,
                leftThighDst,

                rightForeFootSrc,
                rightFootSrc,
                rightLegSrc,
                rightThighSrc,
                rightForeFootDst,
                rightFootDst,
                rightLegDst,
                rightThighDst,

                neckSrc,
                spine2Src,
                spine1Src,
                spine0Src,
                hipsSrc,
                neckDst,
                spine2Dst,
                spine1Dst,
                spine0Dst,
                hipsDst
            }
        ) => {
            setDirection(leftShoulderDst, leftShoulderSrc, leftArmSrc)
            setDirection(leftArmDst, leftArmSrc, leftForeArmSrc)
            setDirection(leftForeArmDst, leftForeArmSrc, leftHandSrc)

            setDirection(rightShoulderDst, rightShoulderSrc, rightArmSrc)
            setDirection(rightArmDst, rightArmSrc, rightForeArmSrc)
            setDirection(rightForeArmDst, rightForeArmSrc, rightHandSrc)

            setDirection(leftThighDst, leftThighSrc, leftLegSrc)
            setDirection(leftLegDst, leftLegSrc, leftFootSrc)
            setDirection(leftFootDst, leftFootSrc, leftForeFootSrc)

            setDirection(rightThighDst, rightThighSrc, rightLegSrc)
            setDirection(rightLegDst, rightLegSrc, rightFootSrc)
            setDirection(rightFootDst, rightFootSrc, rightForeFootSrc)

            setDirection(neckDst, neckSrc, spine2Src)
            setDirection(spine2Dst, spine2Src, spine1Src)
            setDirection(spine1Dst, spine1Src, spine0Src)
            setDirection(spine0Dst, spine0Src, hipsSrc)
        }
    }
)
