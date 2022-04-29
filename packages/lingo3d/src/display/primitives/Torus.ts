import { TorusBufferGeometry } from "three"
import { scaleDown } from "../../engine/constants"
import Primitive from "../core/Primitive"
import torusShape from "../core/SimpleObjectManager/PhysicsItem/cannon/shapes/torusShape"

const geometry = new TorusBufferGeometry(40 * scaleDown, 10 * scaleDown, 8, 16)

export default class Torus extends Primitive {
    public static componentName = "torus"

    protected override _physicsShape = torusShape
    
    public constructor() {
        super(geometry)
    }
}