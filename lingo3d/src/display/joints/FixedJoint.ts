import IFixedJoint, {
    fixedJointDefaults,
    fixedJointSchema
} from "../../interface/IFixedJoint"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"
import { physxPtr } from "../../pointers/physxPtr"

const createFixed = (actor0: any, pose0: any, actor1: any, pose1: any) => {
    const { physics, Px } = physxPtr[0]
    const j = Px.FixedJointCreate(physics, actor0, pose0, actor1, pose1)
    // j->setBreakForce(1000, 100000);
    // j->setConstraintFlag(PxConstraintFlag::eDRIVE_LIMITS_ARE_FORCES, true);
    // j->setConstraintFlag(PxConstraintFlag::eDISABLE_PREPROCESSING, true);
    return j
}

export default class FixedJoint extends JointBase implements IFixedJoint {
    public static componentName = "fixedJoint"
    public static defaults = fixedJointDefaults
    public static schema = fixedJointSchema

    public $createJoint(
        fromPxTransform: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ) {
        return createFixed(
            fromManager.$actor,
            fromPxTransform,
            toManager.$actor,
            toPxTransform
        )
    }
}
