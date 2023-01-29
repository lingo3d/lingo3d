import { deg2Rad } from "@lincode/math"
import ISphericalJoint, {
    sphericalJointDefaults,
    sphericalJointSchema
} from "../../interface/ISphericalJoint"
import debounceSystem from "../../utils/debounceSystem"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"
import destroy from "../core/PhysicsObjectManager/physx/destroy"
import { physxPtr } from "../core/PhysicsObjectManager/physx/physxPtrr"

const createSpherical = (actor0: any, pose0: any, actor1: any, pose1: any) => {
    const { physics, Px } = physxPtr[0]
    return Px.SphericalJointCreate(physics, actor0, pose0, actor1, pose1)
}

const configJointSystem = debounceSystem((target: SphericalJoint) => {
    const { pxJoint, limited, limitY, limitZ } = target
    if (!pxJoint) return

    const { PxJointLimitCone, PxSphericalJointFlagEnum } = physxPtr[0]
    if (limited) {
        const cone = new PxJointLimitCone(
            limitY * deg2Rad,
            limitZ * deg2Rad,
            0.05
        )
        pxJoint.setLimitCone(cone)
        destroy(cone)
    }
    pxJoint.setSphericalJointFlag(
        PxSphericalJointFlagEnum.eLIMIT_ENABLED(),
        limited
    )
})

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
        configJointSystem(this)
        return createSpherical(
            fromManager.actor,
            fromPxTransform,
            toManager.actor,
            toPxTransform
        )
    }

    private _limited?: boolean
    public get limited() {
        return this._limited ?? false
    }
    public set limited(val) {
        this._limited = val
        configJointSystem(this)
    }

    private _limitY?: number
    public get limitY() {
        return this._limitY ?? 360
    }
    public set limitY(val) {
        this._limitY = val
        configJointSystem(this)
    }

    private _limitZ?: number
    public get limitZ() {
        return this._limitZ ?? 360
    }
    public set limitZ(val) {
        this._limitZ = val
        configJointSystem(this)
    }
}
