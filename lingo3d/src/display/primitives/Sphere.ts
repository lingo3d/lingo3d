import { SphereGeometry } from "three"
import Primitive from "../core/Primitive"

export const sphereGeometry = new SphereGeometry(0.5)

export default class Sphere extends Primitive {
    public static componentName = "sphere"

    public constructor() {
        super(sphereGeometry)
    }

    // public override getPxShape(_: PhysicsOptions, actor: any) {
    //     const { material, shapeFlags, physics, PxBoxGeometry, pxFilterData } =
    //         physXPtr[0]

    //     const { x, y, z } = getActualScale(this).multiplyScalar(0.5)
    //     const pxGeometry = new PxBoxGeometry(x, y, z)
    //     const shape = physics.createShape(
    //         pxGeometry,
    //         material,
    //         true,
    //         shapeFlags
    //     )
    //     shape.setSimulationFilterData(pxFilterData)
    //     destroy(pxGeometry)
    //     actor.attachShape(shape)
    //     return shape
    // }
}
