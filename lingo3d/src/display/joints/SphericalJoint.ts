import { deg2Rad } from "@lincode/math"
import ISphericalJoint, {
    sphericalJointDefaults,
    sphericalJointSchema
} from "../../interface/ISphericalJoint"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"
import destroy from "../core/PhysicsObjectManager/physx/destroy"
import { physxPtr } from "../core/PhysicsObjectManager/physx/physxPtr"

const createLimitedSpherical = (
    actor0: any,
    pose0: any,
    actor1: any,
    pose1: any,
    limitY?: number,
    limitZ?: number
) => {
    const { physics, Px, PxJointLimitCone, PxSphericalJointFlagEnum } =
        physxPtr[0]

    const joint = Px.SphericalJointCreate(physics, actor0, pose0, actor1, pose1)
    if (limitY !== undefined && limitZ !== undefined) {
        const cone = new PxJointLimitCone(
            limitY * deg2Rad,
            limitZ * deg2Rad,
            0.05
        )
        joint.setLimitCone(cone)
        destroy(cone)
        joint.setSphericalJointFlag(
            PxSphericalJointFlagEnum.eLIMIT_ENABLED(),
            true
        )
    }
    return joint
}

export default class SphericalJoint
    extends JointBase
    implements ISphericalJoint
{
    public static componentName = "sphericalJoint"
    public static defaults = sphericalJointDefaults
    public static schema = sphericalJointSchema

    protected createJoint(
        fromPxTransform: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ) {
        return createLimitedSpherical(
            fromManager.actor,
            fromPxTransform,
            toManager.actor,
            toPxTransform,
            this._limitY,
            this._limitZ
        )
    }

    private _limitY?: number
    public get limitY() {
        return this._limitY
    }
    public set limitY(val) {
        this._limitY = val
        this.refreshState.set({})
    }

    private _limitZ?: number
    public get limitZ() {
        return this._limitZ
    }
    public set limitZ(val) {
        this._limitZ = val
        this.refreshState.set({})
    }
}
