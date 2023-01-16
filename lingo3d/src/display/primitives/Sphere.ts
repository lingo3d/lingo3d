import { SphereGeometry } from "three"
import { PhysicsOptions } from "../../interface/IPhysicsObjectManager"
import { physXPtr } from "../../states/usePhysX"
import cookConvexGeometry from "../core/PhysicsObjectManager/physx/cookConvexGeometry"
import destroy from "../core/PhysicsObjectManager/physx/destroy"
import Primitive from "../core/Primitive"
import getActualScale from "../utils/getActualScale"

export const sphereGeometry = new SphereGeometry(0.5)

export default class Sphere extends Primitive {
    public static componentName = "sphere"

    public constructor() {
        super(sphereGeometry)
    }

    public override getPxShape(_: PhysicsOptions, actor: any) {
        const {
            material,
            shapeFlags,
            physics,
            PxSphereGeometry,
            pxFilterData,
            PxRigidActorExt
        } = physXPtr[0]

        const { x, y, z } = getActualScale(this).multiplyScalar(0.5)
        if (x === y && x === z) {
            const pxGeometry = new PxSphereGeometry(x)
            const shape = physics.createShape(
                pxGeometry,
                material,
                true,
                shapeFlags
            )
            shape.setSimulationFilterData(pxFilterData)
            destroy(pxGeometry)
            actor.attachShape(shape)
            return shape
        }

        const pxGeometry = cookConvexGeometry(
            `sphere(${x},${y},${z})`,
            this.object3d,
            this
        )
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
