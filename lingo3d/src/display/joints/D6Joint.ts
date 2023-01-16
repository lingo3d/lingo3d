import ID6Joint, {
    d6JointDefaults,
    d6JointSchema,
    D6Motion
} from "../../interface/ID6Joint"
import { physXPtr } from "../../states/usePhysX"
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
const motionToString = (val?: number) => {
    const { PxD6MotionEnum } = physXPtr[0]
    switch (val) {
        case PxD6MotionEnum.eLOCKED():
            return "eLOCKED"
        case PxD6MotionEnum.eLIMITED():
            return "eLIMITED"
        case PxD6MotionEnum.eFREE():
            return "eFREE"
        default:
            return "eFREE"
    }
}

export default class D6Joint extends JointBase {
    public static componentName = "D6Joint"
    public static defaults = d6JointDefaults
    public static schema = d6JointSchema

    private joint?: any

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

    public get distanceLimit() {
        return this.joint?.getDistanceLimit()
    }
    public set distanceLimit(value) {
        this.joint?.setDistanceLimit(value)
    }

    public get eX() {
        return motionToString(
            this.joint?.getMotion(physXPtr[0].PxD6AxisEnum.eX())
        )
    }
    public set eX(value: D6Motion | undefined) {
        this.joint?.setMotion(
            physXPtr[0].PxD6AxisEnum.eX(),
            stringToMotion(value)
        )
    }
}

// eX: String,
//     eY: String,
//     eZ: String,
//     eSWING1: String,
//     eSWING2: String,
//     eTWIST: String,
//     eCOUNT: String
