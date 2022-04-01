import { OctahedronBufferGeometry } from "three"
import { radiusScaled } from "../../engine/constants"
import { primitiveDefaults } from "../../interface/IPrimitive"
import Primitive from "../core/Primitive"

const geometry = new OctahedronBufferGeometry(radiusScaled)

export default class Octahedron extends Primitive {
    public static componentName = "octahedron"
    public static defaults = primitiveDefaults

    public constructor() {
        super(geometry)
    }
}