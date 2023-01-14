import { deg2Rad } from "@lincode/math"
import ISphericalJoint, {
    sphericalJointDefaults,
    sphericalJointSchema
} from "../../interface/ISphericalJoint"
import { getPhysX } from "../../states/usePhysX"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"
import destroy from "../core/PhysicsObjectManager/physx/destroy"

export default class zFixedJoint extends JointBase {
    protected createJoint(
        fromPxTransform: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ) {}
}
