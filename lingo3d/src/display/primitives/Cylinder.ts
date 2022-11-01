import { CylinderGeometry } from "three"
import { diameterScaled, radiusScaled } from "../../engine/constants"
import cylinderShape from "../core/PhysicsObjectManager/cannon/shapes/cylinderShape"
import Primitive from "../core/Primitive"

const geometry = new CylinderGeometry(
    radiusScaled,
    radiusScaled,
    diameterScaled,
    16
)

export default class Cylinder extends Primitive {
    public static componentName = "cylinder"

    protected override physicsShape = cylinderShape

    public constructor() {
        super(geometry)
    }
}
