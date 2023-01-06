import { OctahedronGeometry } from "three"
import Primitive from "../core/Primitive"

const geometry = new OctahedronGeometry(0.5)

export default class Octahedron extends Primitive {
    public static componentName = "octahedron"

    public constructor() {
        super(geometry)
    }
}
