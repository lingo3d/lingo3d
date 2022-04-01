import { TetrahedronBufferGeometry } from "three"
import Primitive from "../core/Primitive"
import { deg2Rad } from "@lincode/math"
import { scaleDown } from "../../engine/constants"
import { primitiveDefaults } from "../../interface/IPrimitive"

const geometry = new TetrahedronBufferGeometry(61 * scaleDown)
geometry.rotateY(45 * deg2Rad)
geometry.rotateX(125 * deg2Rad)
geometry.translate(0, -0.2, 0.2)

export default class Tetrahedron extends Primitive {
    public static componentName = "tetrahedron"
    public static defaults = primitiveDefaults

    public constructor() {
        super(geometry)
    }
}