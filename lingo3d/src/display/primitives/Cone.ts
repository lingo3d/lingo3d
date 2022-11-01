import { ConeGeometry } from "three"
import { diameterScaled, radiusScaled } from "../../engine/constants"
import cylinderShape from "../core/PhysicsObjectManager/cannon/shapes/cylinderShape"
import Primitive from "../core/Primitive"

const geometry = new ConeGeometry(radiusScaled, diameterScaled, 16)

export default class Cone extends Primitive {
    public static componentName = "cone"

    protected override physicsShape = cylinderShape

    public constructor() {
        super(geometry)
    }
}
