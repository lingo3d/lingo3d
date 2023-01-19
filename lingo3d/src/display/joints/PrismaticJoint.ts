import { deg2Rad } from "@lincode/math"
import { CM2M } from "../../globals"
import IPrismaticJoint, {
    prismaticJointDefaults,
    prismaticJointSchema
} from "../../interface/IPrismaticJoint"
import debounceSystem from "../../utils/debounceSystem"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"
import destroy from "../core/PhysicsObjectManager/physx/destroy"
import { physxPtr } from "../core/PhysicsObjectManager/physx/physxPtr"

const createPrismatic = (actor0: any, pose0: any, actor1: any, pose1: any) => {
    const { physics, Px } = physxPtr[0]
    return Px.PrismaticJointCreate(physics, actor0, pose0, actor1, pose1)
}

const configJointSystem = debounceSystem((target: PrismaticJoint) => {
    const { pxJoint, limitLow, limitHigh } = target
    if (!pxJoint) return

    const { PxJointLinearLimitPair } = physxPtr[0]

    const linearLimit = new PxJointLinearLimitPair(
        limitLow * CM2M,
        limitHigh * CM2M
    )
    // linearLimit.stiffness = linearStiffnessX
    // linearLimit.damping = linearDampingX
    // pxJoint.setLinearLimit(PxD6AxisEnum.eX(), linearLimit)
    destroy(linearLimit)
})

export default class PrismaticJoint
    extends JointBase
    implements IPrismaticJoint
{
    public static componentName = "prismaticJoint"
    public static defaults = prismaticJointDefaults
    public static schema = prismaticJointSchema

    protected createJoint(
        fromPxTransform: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ) {
        return createPrismatic(
            fromManager.actor,
            fromPxTransform,
            toManager.actor,
            toPxTransform
        )
    }

    private _limitLow?: number
    public get limitLow() {
        return this._limitLow ?? -100
    }
    public set limitLow(val) {
        this._limitLow = val
        configJointSystem(this)
    }

    private _limitHigh?: number
    public get limitHigh() {
        return this._limitHigh ?? -100
    }
    public set limitHigh(val) {
        this._limitHigh = val
        configJointSystem(this)
    }
}
