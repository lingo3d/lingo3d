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
    const { pxJoint, limited, limitLow, limitHigh, stiffness, damping } = target
    if (!pxJoint || !limited) return

    const { PxJointLinearLimitPair, PxPrismaticJointFlagEnum } = physxPtr[0]

    const linearLimit = new PxJointLinearLimitPair(
        limitLow * CM2M,
        limitHigh * CM2M
    )
    linearLimit.stiffness = stiffness
    linearLimit.damping = damping
    pxJoint.setLimit(linearLimit)
    destroy(linearLimit)
    pxJoint.setPrismaticJointFlag(
        PxPrismaticJointFlagEnum.eLIMIT_ENABLED(),
        true
    )
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
        configJointSystem(this)
        return createPrismatic(
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
        val ? configJointSystem(this) : this.refreshState.set({})
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
        return this._limitHigh ?? 100
    }
    public set limitHigh(val) {
        this._limitHigh = val
        configJointSystem(this)
    }

    private _stiffness?: number
    public get stiffness() {
        return this._stiffness ?? 0
    }
    public set stiffness(val) {
        this._stiffness = val
        configJointSystem(this)
    }

    private _damping?: number
    public get damping() {
        return this._damping ?? 0
    }
    public set damping(val) {
        this._damping = val
        configJointSystem(this)
    }
}
