import { TorusGeometry } from "three"
import { scaleDown } from "../../engine/constants"
import torusShape from "../core/PhysicsObjectManager/cannon/shapes/torusShape"
import Primitive from "../core/Primitive"

const geometry = new TorusGeometry(40 * scaleDown, 1 * scaleDown, 8, 32)

export default class Torus extends Primitive {
    public static componentName = "torus"

    protected override physicsShape = torusShape

    public constructor() {
        super(geometry)
    }
}
