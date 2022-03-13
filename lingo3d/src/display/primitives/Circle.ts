import { CircleBufferGeometry } from "three"
import Primitive from "../core/Primitive"
import { flatGeomScaleZ, radiusScaled } from "../../engine/constants"
import circleShape from "../../physics/shapes/circleShape"

export const circleGeometry = new CircleBufferGeometry(radiusScaled, 32)

export default class Circle extends Primitive {
    protected override _physicsShape = circleShape

    public constructor() {
        super(circleGeometry, true)
        this.object3d.scale.z = flatGeomScaleZ
    }
}