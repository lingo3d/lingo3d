import { PlaneGeometry } from "three"
import { diameterScaled, flatGeomScaleZ } from "../../engine/constants"
import IPlane, { planeDefaults, planeSchema } from "../../interface/IPlane"
import Primitive from "../core/Primitive"

export const planeGeometry = new PlaneGeometry(
    diameterScaled,
    diameterScaled,
    1,
    1
)

export default class Plane extends Primitive implements IPlane {
    public static componentName = "plane"
    public static override defaults = planeDefaults
    public static override schema = planeSchema

    public constructor() {
        super(planeGeometry)
        this.object3d.scale.z = flatGeomScaleZ
    }

    public override get depth() {
        return 0
    }
    public override set depth(_) {}
    public override get scaleZ() {
        return 0
    }
    public override set scaleZ(_) {}
}
