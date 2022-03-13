import { CylinderBufferGeometry } from "three"
import { diameterScaled, radiusScaled } from "../../engine/constants"
import Primitive from "../core/Primitive"
import cylinderShape from "../../physics/shapes/cylinderShape"

const geometry = new CylinderBufferGeometry(radiusScaled, radiusScaled, diameterScaled, 16)

export default class Cylinder extends Primitive {
    protected override _physicsShape = cylinderShape

    public constructor() {
        super(geometry)
    }
}