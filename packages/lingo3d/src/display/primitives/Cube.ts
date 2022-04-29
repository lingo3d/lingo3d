import { BoxBufferGeometry } from "three"
import { diameterScaled } from "../../engine/constants"
import Primitive from "../core/Primitive"

export const boxGeometry = new BoxBufferGeometry(diameterScaled, diameterScaled, diameterScaled, 1, 1, 1)

export default class Cube extends Primitive {
    public static componentName = "cube"

    public constructor() {
        super(boxGeometry)
    }
}