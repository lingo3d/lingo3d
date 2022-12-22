import { BoxGeometry } from "three"
import Primitive from "../core/Primitive"

export const boxGeometry = new BoxGeometry(1, 1, 1, 1, 1, 1)

export default class Cube extends Primitive {
    public static componentName = "cube"

    public constructor() {
        super(boxGeometry)
    }
}
