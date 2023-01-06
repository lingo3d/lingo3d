import { CircleGeometry } from "three"
import Primitive, { allocateDefaultInstance } from "../core/Primitive"
import ICircle, { circleDefaults, circleSchema } from "../../interface/ICircle"
import { deg2Rad } from "@lincode/math"

allocateDefaultInstance(CircleGeometry, [0.5, 32, 0, 360 * deg2Rad])

export default class Circle
    extends Primitive<typeof CircleGeometry>
    implements ICircle
{
    public static componentName = "circle"
    public static override defaults = circleDefaults
    public static override schema = circleSchema

    public constructor() {
        super(CircleGeometry, [0.5, 32, 0, 360 * deg2Rad])
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

    private _theta?: number
    public get theta() {
        return this._theta ?? 360
    }
    public set theta(val) {
        this._theta = val
        this.refreshParams([0.5, 32, 0, val * deg2Rad])
    }
}
