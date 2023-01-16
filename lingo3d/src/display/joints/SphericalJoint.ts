import { deg2Rad } from "@lincode/math"
import ISphericalJoint, {
    sphericalJointDefaults,
    sphericalJointSchema
} from "../../interface/ISphericalJoint"
import { getPhysX, physXPtr } from "../../states/usePhysX"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"
import destroy from "../core/PhysicsObjectManager/physx/destroy"

const createLimitedSpherical = (
    actor0: any,
    pose0: any,
    actor1: any,
    pose1: any,
    yLimitAngle?: number,
    zLimitAngle?: number
) => {
    const { physics, Px, PxJointLimitCone, PxSphericalJointFlagEnum } =
        physXPtr[0]

    const joint = Px.SphericalJointCreate(physics, actor0, pose0, actor1, pose1)
    if (yLimitAngle !== undefined && zLimitAngle !== undefined) {
        const cone = new PxJointLimitCone(
            yLimitAngle * deg2Rad,
            zLimitAngle * deg2Rad,
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
            this._yLimitAngle,
            this._zLimitAngle
        )
    }

    private _yLimitAngle?: number
    public get yLimitAngle() {
        return this._yLimitAngle
    }
    public set yLimitAngle(val) {
        this._yLimitAngle = val
        this.refreshState.set({})
    }

    private _zLimitAngle?: number
    public get zLimitAngle() {
        return this._zLimitAngle
    }
    public set zLimitAngle(val) {
        this._zLimitAngle = val
        this.refreshState.set({})
    }
}
