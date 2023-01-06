import { SphereGeometry } from "three"
import Primitive from "../core/Primitive"

export const sphereGeometry = new SphereGeometry(0.5)

export default class Sphere extends Primitive {
    public static componentName = "sphere"

    public constructor() {
        super(sphereGeometry)
    }
}
