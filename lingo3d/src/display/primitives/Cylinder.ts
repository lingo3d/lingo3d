import { CylinderGeometry } from "three"
import Primitive from "../core/Primitive"

export const cylinderGeometry = new CylinderGeometry(0.5, 0.5, 1, 16)

export default class Cylinder extends Primitive {
    public static componentName = "cylinder"

    public constructor() {
        super(cylinderGeometry)
    }
}
