import IDistanceJoint, {
    distanceJointDefaults,
    distanceJointSchema
} from "../../interface/IDistanceJoint"
import { physXPtr } from "../../states/usePhysX"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"

const createDistance = (actor0: any, pose0: any, actor1: any, pose1: any) => {
    const { physics, Px } = physXPtr[0]
    return Px.DistanceJointCreate(physics, actor0, pose0, actor1, pose1)
}

export default class DistanceJoint extends JointBase implements IDistanceJoint {
    public static componentName = "distanceJoint"
    public static defaults = distanceJointDefaults
    public static schema = distanceJointSchema

    protected createJoint(
        fromPxTransform: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ) {
        return createDistance(
            fromManager.actor,
            fromPxTransform,
            toManager.actor,
            toPxTransform
        )
    }
}
