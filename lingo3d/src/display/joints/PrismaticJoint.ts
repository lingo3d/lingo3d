import IPrismaticJoint, {
    prismaticJointDefaults,
    prismaticJointSchema
} from "../../interface/IPrismaticJoint"
import { addConfigPrismaticJointSystem } from "../../systems/configPrismaticJointSystem"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"
import { physxPtr } from "../core/PhysicsObjectManager/physx/physxPtr"

const createPrismatic = (actor0: any, pose0: any, actor1: any, pose1: any) => {
    const { physics, Px } = physxPtr[0]
    return Px.PrismaticJointCreate(physics, actor0, pose0, actor1, pose1)
}

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
        addConfigPrismaticJointSystem(this)
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
        addConfigPrismaticJointSystem(this)
    }

    private _limitLow?: number
    public get limitLow() {
        return this._limitLow ?? -100
    }
    public set limitLow(val) {
        this._limitLow = val
        addConfigPrismaticJointSystem(this)
    }

    private _limitHigh?: number
    public get limitHigh() {
        return this._limitHigh ?? 100
    }
    public set limitHigh(val) {
        this._limitHigh = val
        addConfigPrismaticJointSystem(this)
    }

    private _stiffness?: number
    public get stiffness() {
        return this._stiffness ?? 0
    }
    public set stiffness(val) {
        this._stiffness = val
        addConfigPrismaticJointSystem(this)
    }

    private _damping?: number
    public get damping() {
        return this._damping ?? 0
    }
    public set damping(val) {
        this._damping = val
        addConfigPrismaticJointSystem(this)
    }
}
