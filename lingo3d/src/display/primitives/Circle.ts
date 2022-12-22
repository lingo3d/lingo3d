import { CircleGeometry } from "three"
import Primitive from "../core/Primitive"
import ICircle, { circleDefaults, circleSchema } from "../../interface/ICircle"

const circleGeometry = new CircleGeometry(0.5, 32)

export default class Circle extends Primitive implements ICircle {
    public static componentName = "circle"
    public static override defaults = circleDefaults
    public static override schema = circleSchema

    public constructor() {
        super(circleGeometry)
        this.object3d.scale.z = Number.EPSILON
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
