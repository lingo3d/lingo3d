import ID6Joint, {
    d6JointDefaults,
    d6JointSchema,
    D6Motion
} from "../../interface/ID6Joint"
import { physXPtr } from "../../states/usePhysX"
import debounceSystem from "../../utils/debounceSystem"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"

const createD6 = (actor0: any, pose0: any, actor1: any, pose1: any) => {
    const { physics, Px } = physXPtr[0]
    return Px.D6JointCreate(physics, actor0, pose0, actor1, pose1)
}

const stringToMotion = (val?: D6Motion) => {
    const { PxD6MotionEnum } = physXPtr[0]
    switch (val) {
        case "eLOCKED":
            return PxD6MotionEnum.eLOCKED()
        case "eLIMITED":
            return PxD6MotionEnum.eLIMITED()
        case "eFREE":
            return PxD6MotionEnum.eFREE()
        default:
            return PxD6MotionEnum.eFREE()
    }
}

const configJointSystem = debounceSystem((target: D6Joint) => {
    const { joint } = target
    const { PxD6AxisEnum } = physXPtr[0]
    const { eX, eY, eZ, eSWING1, eSWING2, eTWIST } = target
    eX !== undefined && joint.setMotion(PxD6AxisEnum.eX(), stringToMotion(eX))
    eY !== undefined && joint.setMotion(PxD6AxisEnum.eY(), stringToMotion(eY))
    eZ !== undefined && joint.setMotion(PxD6AxisEnum.eZ(), stringToMotion(eZ))
    eSWING1 !== undefined &&
        joint.setMotion(PxD6AxisEnum.eSWING1(), stringToMotion(eSWING1))
    eSWING2 !== undefined &&
        joint.setMotion(PxD6AxisEnum.eSWING2(), stringToMotion(eSWING2))
    eTWIST !== undefined &&
        joint.setMotion(PxD6AxisEnum.eTWIST(), stringToMotion(eTWIST))
})

export default class D6Joint extends JointBase implements ID6Joint {
    public static componentName = "d6Joint"
    public static defaults = d6JointDefaults
    public static schema = d6JointSchema

    public joint: any

    protected override onCreateJoint() {
        configJointSystem(this)
    }

    protected createJoint(
        fromPxTransform: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ) {
        return (this.joint = createD6(
            fromManager.actor,
            fromPxTransform,
            toManager.actor,
            toPxTransform
        ))
    }

    private _eX?: D6Motion
    public get eX() {
        return this._eX
    }
    public set eX(val) {
        this._eX = val
        configJointSystem(this)
    }

    private _eY?: D6Motion
    public get eY() {
        return this._eY
    }
    public set eY(val) {
        this._eY = val
        configJointSystem(this)
    }

    private _eZ?: D6Motion
    public get eZ() {
        return this._eZ
    }
    public set eZ(val) {
        this._eZ = val
        configJointSystem(this)
    }

    private _eSWING1?: D6Motion
    public get eSWING1() {
        return this._eSWING1
    }
    public set eSWING1(val) {
        this._eSWING1 = val
        configJointSystem(this)
    }

    private _eSWING2?: D6Motion
    public get eSWING2() {
        return this._eSWING2
    }
    public set eSWING2(val) {
        this._eSWING2 = val
        configJointSystem(this)
    }

    private _eTWIST?: D6Motion
    public get eTWIST() {
        return this._eTWIST
    }
    public set eTWIST(val) {
        this._eTWIST = val
        configJointSystem(this)
    }
}
