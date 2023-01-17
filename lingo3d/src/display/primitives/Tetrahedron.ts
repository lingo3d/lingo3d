import { TetrahedronGeometry } from "three"
import Primitive from "../core/Primitive"
import { deg2Rad } from "@lincode/math"
import { PhysicsOptions } from "../../interface/IPhysicsObjectManager"
import { physXPtr } from "../../states/usePhysX"
import cookConvexGeometry from "../core/PhysicsObjectManager/physx/cookConvexGeometry"

const geometry = new TetrahedronGeometry(0.61)
geometry.rotateY(45 * deg2Rad)
geometry.rotateX(125 * deg2Rad)
geometry.translate(0, -0.2, 0.2)

export default class Tetrahedron extends Primitive {
    public static componentName = "tetrahedron"

    public constructor() {
        super(geometry)
    }

    public override getPxShape(_: PhysicsOptions, actor: any) {
        const { material, shapeFlags, pxFilterData, PxRigidActorExt } =
            physXPtr[0]

        const pxGeometry = cookConvexGeometry("tetrahedron", this)
        const shape = PxRigidActorExt.prototype.createExclusiveShape(
            actor,
            pxGeometry,
            material,
            shapeFlags
        )
        shape.setSimulationFilterData(pxFilterData)
        return shape
    }
}
