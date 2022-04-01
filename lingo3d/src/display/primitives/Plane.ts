import { PlaneBufferGeometry } from "three"
import { diameterScaled, flatGeomScaleZ } from "../../engine/constants"
import { primitiveDefaults } from "../../interface/IPrimitive"
import Primitive from "../core/Primitive"

export const planeGeometry = new PlaneBufferGeometry(diameterScaled, diameterScaled, 1, 1)

export default class Plane extends Primitive {
    public static componentName = "plane"
    public static defaults = primitiveDefaults

    public constructor() {
        super(planeGeometry, true)
        this.object3d.scale.z = flatGeomScaleZ
    }
}