import IRevoluteJoint, {
    revoluteJointDefaults,
    revoluteJointSchema
} from "../../interface/IRevoluteJoint"
import { addConfigRevoluteJointSystem } from "../../systems/autoClear/configRevoluteJointSystem"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"
import { physxPtr } from "../core/PhysicsObjectManager/physx/physxPtr"

const createRevolute = (actor0: any, pose0: any, actor1: any, pose1: any) => {
    const { physics, Px } = physxPtr[0]
    return Px.RevoluteJointCreate(physics, actor0, pose0, actor1, pose1)
}

export default class RevoluteJoint extends JointBase implements IRevoluteJoint {
    public static componentName = "revoluteJoint"
    public static defaults = revoluteJointDefaults
    public static schema = revoluteJointSchema

    protected createJoint(
        fromPxTransform: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ) {
        addConfigRevoluteJointSystem(this)
        return createRevolute(
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
        addConfigRevoluteJointSystem(this)
    }

    private _limitLow?: number
    public get limitLow() {
        return this._limitLow ?? -360
    }
    public set limitLow(val) {
        this._limitLow = val
        addConfigRevoluteJointSystem(this)
    }

    private _limitHigh?: number
    public get limitHigh() {
        return this._limitHigh ?? 360
    }
    public set limitHigh(val) {
        this._limitHigh = val
        addConfigRevoluteJointSystem(this)
    }

    private _stiffness?: number
    public get stiffness() {
        return this._stiffness ?? 0
    }
    public set stiffness(val) {
        this._stiffness = val
        addConfigRevoluteJointSystem(this)
    }

    private _damping?: number
    public get damping() {
        return this._damping ?? 0
    }
    public set damping(val) {
        this._damping = val
        addConfigRevoluteJointSystem(this)
    }

    private _driveVelocity?: number
    public get driveVelocity() {
        return this._driveVelocity ?? 0
    }
    public set driveVelocity(val) {
        this._driveVelocity = val
        addConfigRevoluteJointSystem(this)
    }
}
