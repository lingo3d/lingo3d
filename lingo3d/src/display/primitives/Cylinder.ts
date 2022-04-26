import { CylinderBufferGeometry } from "three"
import { diameterScaled, radiusScaled } from "../../engine/constants"
import Primitive from "../core/Primitive"
import cylinderShape from "../core/SimpleObjectManager/PhysicsItem/cannon/shapes/cylinderShape"

const geometry = new CylinderBufferGeometry(radiusScaled, radiusScaled, diameterScaled, 16)

export default class Cylinder extends Primitive {
    public static componentName = "cylinder"

    protected override _physicsShape = cylinderShape

    public constructor() {
        super(geometry)
    }
}