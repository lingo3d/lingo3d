import { SphereBufferGeometry } from "three"
import Primitive from "../core/Primitive"
import { radiusScaled } from "../../engine/constants"
import sphereShape from "../core/SimpleObjectManager/PhysicsItem/cannon/shapes/sphereShape"
import { primitiveDefaults } from "../../interface/IPrimitive"

const geometry = new SphereBufferGeometry(radiusScaled, 16, 16)

export default class Sphere extends Primitive {
    public static componentName = "sphere"
    public static defaults = primitiveDefaults

    protected override _physicsShape = sphereShape

    public constructor() {
        super(geometry)
    }
}