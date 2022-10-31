import { TorusGeometry } from "three"
import { scaleDown } from "../../engine/constants"
import Primitive from "../core/Primitive"

const geometry = new TorusGeometry(40 * scaleDown, 1 * scaleDown, 8, 32)

export default class Torus extends Primitive {
    public static componentName = "torus"

    public constructor() {
        super(geometry)
    }
}
