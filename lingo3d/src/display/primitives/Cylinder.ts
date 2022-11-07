import { CylinderGeometry } from "three"
import { diameterScaled, radiusScaled } from "../../engine/constants"
import Primitive from "../core/Primitive"

export const cylinderGeometry = new CylinderGeometry(
    radiusScaled,
    radiusScaled,
    diameterScaled,
    16
)

export default class Cylinder extends Primitive {
    public static componentName = "cylinder"

    public constructor() {
        super(cylinderGeometry)
    }
}
