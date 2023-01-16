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
    const j = Px.D6JointCreate(physics, actor0, pose0, actor1, pose1)
    return j
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
    const { distanceLimit, eX } = target
    distanceLimit !== undefined && joint.setDistanceLimit(distanceLimit)
    eX !== undefined && joint.setMotion(PxD6AxisEnum.eX(), stringToMotion(eX))
})

export default class D6Joint extends JointBase {
    public static componentName = "d6Joint"
    public static defaults = d6JointDefaults
    public static schema = d6JointSchema

    public joint: any

    protected createJoint(
        fromPxTransform: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ) {
        configJointSystem(this)
        return (this.joint = createD6(
            fromManager.actor,
            fromPxTransform,
            toManager.actor,
            toPxTransform
        ))
    }

    private _distanceLimit?: number
    public get distanceLimit() {
        return this._distanceLimit
    }
    public set distanceLimit(val) {
        this._distanceLimit = val
        configJointSystem(this)
    }

    private _eX?: D6Motion
    public get eX() {
        return this._eX
    }
    public set eX(val) {
        this._eX = val
        configJointSystem(this)
    }
}

// eX: String,
//     eY: String,
//     eZ: String,
//     eSWING1: String,
//     eSWING2: String,
//     eTWIST: String,
//     eCOUNT: String
