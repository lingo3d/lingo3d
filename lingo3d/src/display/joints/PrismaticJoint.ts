import IPrismaticJoint, {
    prismaticJointDefaults,
    prismaticJointSchema
} from "../../interface/IPrismaticJoint"
import { getPhysX, physXPtr } from "../../states/usePhysX"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"

const createPrismatic = (actor0: any, pose0: any, actor1: any, pose1: any) => {
    const { physics, Px } = physXPtr[0]
    const j = Px.PrismaticJointCreate(physics, actor0, pose0, actor1, pose1)
    return j
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
        return createPrismatic(
            fromManager.actor,
            fromPxTransform,
            toManager.actor,
            toPxTransform
        )
    }
}
