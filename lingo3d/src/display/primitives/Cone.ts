import { ConeBufferGeometry } from "three"
import { diameterScaled, radiusScaled } from "../../engine/constants"
import { primitiveDefaults } from "../../interface/IPrimitive"
import Primitive from "../core/Primitive"

const geometry = new ConeBufferGeometry(radiusScaled, diameterScaled, 16)

export default class Cone extends Primitive {
    public static componentName = "cone"
    public static defaults = primitiveDefaults

    public constructor() {
        super(geometry)
    }
}