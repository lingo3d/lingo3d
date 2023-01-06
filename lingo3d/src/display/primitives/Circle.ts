import { CircleGeometry } from "three"
import Primitive, {
    allocateDefaultInstance,
    decreaseCount,
    increaseCount
} from "../core/Primitive"
import ICircle, { circleDefaults, circleSchema } from "../../interface/ICircle"
import { deg2Rad } from "@lincode/math"

allocateDefaultInstance(CircleGeometry, [0.5, 32, 0, 360 * deg2Rad])

export default class Circle extends Primitive implements ICircle {
    public static componentName = "circle"
    public static override defaults = circleDefaults
    public static override schema = circleSchema

    private params: Readonly<ConstructorParameters<typeof CircleGeometry>>

    public constructor() {
        const params = <const>[0.5, 32, 0, 360 * deg2Rad]
        super(increaseCount(CircleGeometry, params))
        this.params = params
        this.object3d.scale.z = Number.EPSILON
        this.then(() => decreaseCount(CircleGeometry, this.params))
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
        decreaseCount(CircleGeometry, this.params)
        this.object3d.geometry = increaseCount(
            CircleGeometry,
            (this.params = [0.5, 32, 0, val * deg2Rad])
        )
    }
}
