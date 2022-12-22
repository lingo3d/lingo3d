import { TorusGeometry } from "three"
import Primitive from "../core/Primitive"

const geometry = new TorusGeometry(0.4, 0.01, 8, 32)

export default class Torus extends Primitive {
    public static componentName = "torus"

    public constructor() {
        super(geometry)
    }
}
