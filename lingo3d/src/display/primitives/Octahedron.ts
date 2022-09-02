import { OctahedronGeometry } from "three"
import { radiusScaled } from "../../engine/constants"
import Primitive from "../core/Primitive"

const geometry = new OctahedronGeometry(radiusScaled)

export default class Octahedron extends Primitive {
    public static componentName = "octahedron"

    public constructor() {
        super(geometry)
    }
}
