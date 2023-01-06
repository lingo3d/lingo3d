import { ConeGeometry } from "three"
import Primitive from "../core/Primitive"

const geometry = new ConeGeometry(0.5)

export default class Cone extends Primitive {
    public static componentName = "cone"

    public constructor() {
        super(geometry)
    }
}
