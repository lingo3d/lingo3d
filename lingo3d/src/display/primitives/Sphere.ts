import { SphereGeometry } from "three"
import Primitive from "../core/Primitive"
import { radiusScaled } from "../../engine/constants"

export const sphereGeometry = new SphereGeometry(radiusScaled, 32, 32)

export default class Sphere extends Primitive {
    public static componentName = "sphere"

    public constructor() {
        super(sphereGeometry)
    }
}
