import { BoxGeometry } from "three"
import { diameterScaled } from "../../engine/constants"
import Primitive from "../core/Primitive"

export const boxGeometry = new BoxGeometry(
    diameterScaled,
    diameterScaled,
    diameterScaled,
    1,
    1,
    1
)

export default class Cube extends Primitive {
    public static componentName = "cube"

    public constructor() {
        super(boxGeometry)
    }
}
