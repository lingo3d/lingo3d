import { TetrahedronGeometry } from "three"
import Primitive from "../core/Primitive"
import { DEG2RAD } from "three/src/math/MathUtils"

const geometry = new TetrahedronGeometry(0.61)
geometry.rotateY(45 * DEG2RAD)
geometry.rotateX(125 * DEG2RAD)
geometry.translate(0, -0.2, 0.2)

export default class Tetrahedron extends Primitive {
    public static componentName = "tetrahedron"

    public constructor() {
        super(geometry)
    }
}
