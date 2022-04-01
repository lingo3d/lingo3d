import { BoxBufferGeometry } from "three"
import { diameterScaled } from "../../engine/constants"
import { primitiveDefaults } from "../../interface/IPrimitive"
import Primitive from "../core/Primitive"

export const boxGeometry = new BoxBufferGeometry(diameterScaled, diameterScaled, diameterScaled, 1, 1, 1)

export default class Cube extends Primitive {
    public static componentName = "cube"
    public static defaults = primitiveDefaults

    public constructor() {
        super(boxGeometry)
    }
}