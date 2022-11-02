import { ConeGeometry } from "three"
import { diameterScaled, radiusScaled } from "../../engine/constants"
import Primitive from "../core/Primitive"

const geometry = new ConeGeometry(radiusScaled, diameterScaled, 16)

export default class Cone extends Primitive {
    public static componentName = "cone"

    public constructor() {
        super(geometry)
    }
}
