import { boxGeometry } from "../../primitives/Cube"
import HelperPrimitive from "./HelperPrimitive"

export default class HelperCube extends HelperPrimitive {
    public constructor() {
        super(boxGeometry)
        this.wireframe = true
        this.emissive = true
        this.opacity = 1
    }
}
