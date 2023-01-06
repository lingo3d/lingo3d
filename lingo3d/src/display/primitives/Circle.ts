import { CircleGeometry } from "three"
import ICircle, { circleDefaults, circleSchema } from "../../interface/ICircle"
import { deg2Rad } from "@lincode/math"
import ConfigurablePrimitive, {
    allocateDefaultInstance,
    refreshParamsSystem
} from "../core/ConfigurablePrimitive"

const defaultParams = <const>[0.5, 32, 0, 360 * deg2Rad]
const geometry = allocateDefaultInstance(CircleGeometry, defaultParams)

export default class Circle
    extends ConfigurablePrimitive<typeof CircleGeometry>
    implements ICircle
{
    public static componentName = "circle"
    public static override defaults = circleDefaults
    public static override schema = circleSchema

    public constructor() {
        super(CircleGeometry, defaultParams, geometry)
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

    protected override getParams() {
        return <const>[0.5, 32, 0, (this._theta ?? 360) * deg2Rad]
    }

    private _theta?: number
    public get theta() {
        return this._theta ?? 360
    }
    public set theta(val) {
        this._theta = val
        refreshParamsSystem(this)
    }
}
