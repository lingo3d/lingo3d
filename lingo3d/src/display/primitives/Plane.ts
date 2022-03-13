import { PlaneBufferGeometry } from "three"
import { diameterScaled, flatGeomScaleZ } from "../../engine/constants"
import Primitive from "../core/Primitive"

export const planeGeometry = new PlaneBufferGeometry(diameterScaled, diameterScaled, 1, 1)

export default class Plane extends Primitive {
    public constructor() {
        super(planeGeometry, true)
        this.object3d.scale.z = flatGeomScaleZ
    }
}