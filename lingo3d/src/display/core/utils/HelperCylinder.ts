import { cylinderGeometry } from "../../primitives/Cylinder"
import HelperPrimitive from "./HelperPrimitive"

export default class HelperSphere extends HelperPrimitive {
    public constructor() {
        super(cylinderGeometry)
    }
}
