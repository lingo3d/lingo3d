import { Vector3 } from "three"
import CharacterRig from "../display/CharacterRig"
import CharacterRigJoint from "../display/CharacterRigJoint"
import FoundManager from "../display/core/FoundManager"
import { quaternion_, quaternion__, vector3 } from "../display/utils/reusables"
import direction3d from "../math/direction3d"
import getWorldPosition from "../memo/getWorldPosition"
import createInternalSystem from "./utils/createInternalSystem"
import { frameSyncAlpha } from "../api/frameSync"

const setDirection = (
    parentDst: CharacterRigJoint | undefined,
    parentSrc: FoundManager,
    childSrc: FoundManager
) => {
    if (!parentDst || parentDst.done) return
    quaternion_.copy(parentDst.quaternion)
    parentDst.setRotationFromDirection(
        direction3d(
            getWorldPosition(childSrc.$object),
            getWorldPosition(parentSrc.$object)
        )
    )
    quaternion__.copy(parentDst.quaternion)
    parentDst.quaternion
        .copy(quaternion_)
        .slerp(quaternion__, frameSyncAlpha(0.5))
}

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

            headSrc: FoundManager
            neckSrc: FoundManager
            spine2Src: FoundManager
            spine1Src: FoundManager
            spine0Src: FoundManager
            hipsSrc: FoundManager
            headDst?: CharacterRigJoint
            neckDst?: CharacterRigJoint
            spine2Dst?: CharacterRigJoint
            spine1Dst?: CharacterRigJoint
            spine0Dst?: CharacterRigJoint
            hipsDst?: CharacterRigJoint

            hipsPositionSrc: Vector3
            hipsPositionDst?: Vector3
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

                headSrc,
                neckSrc,
                spine2Src,
                spine1Src,
                spine0Src,
                hipsSrc,
                headDst,
                neckDst,
                spine2Dst,
                spine1Dst,
                spine0Dst,
                hipsDst,

                hipsPositionSrc,
                hipsPositionDst
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

            setDirection(headDst, headSrc, neckSrc)
            setDirection(neckDst, neckSrc, spine2Src)
            setDirection(spine2Dst, spine2Src, spine1Src)
            setDirection(spine1Dst, spine1Src, spine0Src)
            setDirection(spine0Dst, spine0Src, hipsSrc)

            hipsDst?.position
                .copy(hipsPositionDst!)
                .add(
                    vector3
                        .copy(hipsSrc.position)
                        .sub(hipsPositionSrc)
                        .multiplyScalar(hipsSrc.owner.resizeScale)
                )
        }
    }
)
