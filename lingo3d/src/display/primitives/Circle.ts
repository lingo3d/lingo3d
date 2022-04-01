import { CircleBufferGeometry } from "three"
import Primitive from "../core/Primitive"
import { flatGeomScaleZ, radiusScaled } from "../../engine/constants"
import circleShape from "../core/SimpleObjectManager/PhysicsItem/cannon/shapes/circleShape"
import { primitiveDefaults } from "../../interface/IPrimitive"

export const circleGeometry = new CircleBufferGeometry(radiusScaled, 32)

export default class Circle extends Primitive {
    public static componentName = "circle"
    public static defaults = primitiveDefaults

    protected override _physicsShape = circleShape

    public constructor() {
        super(circleGeometry, true)
        this.object3d.scale.z = flatGeomScaleZ
    }
}