import { SphereGeometry } from "three"
import Primitive from "../core/Primitive"
import { radiusScaled } from "../../engine/constants"
import sphereShape from "../core/PhysicsObjectManager/cannon/shapes/sphereShape"

export const sphereGeometry = new SphereGeometry(radiusScaled, 32, 32)

export default class Sphere extends Primitive {
    public static componentName = "sphere"

    protected override _physicsShape = sphereShape

    public constructor() {
        super(sphereGeometry)
    }
}
