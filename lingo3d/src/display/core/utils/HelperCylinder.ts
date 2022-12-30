import { cylinderGeometry } from "../../primitives/Cylinder"
import HelperPrimitive from "./HelperPrimitive"

export default class HelperCylinder extends HelperPrimitive {
    public constructor() {
        super(cylinderGeometry)
    }
}
