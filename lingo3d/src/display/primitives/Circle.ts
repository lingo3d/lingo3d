import { CircleGeometry } from "three"
import ICircle, { circleDefaults, circleSchema } from "../../interface/ICircle"
import { deg2Rad } from "@lincode/math"
import ConfigurablePrimitive, {
    addRefreshParamsSystem
} from "../core/ConfigurablePrimitive"
import { PI2 } from "../../globals"
import { allocateDefaultGeometry } from "../../pools/geometryPool"

const defaultParams = <const>[0.5, 32, 0, PI2]
const geometry = allocateDefaultGeometry(
    CircleGeometry,
    defaultParams
) as CircleGeometry

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

    public override getParams() {
        return <const>[0.5, this.segments, 0, this.theta * deg2Rad]
    }

    private _theta?: number
    public get theta() {
        return this._theta ?? 360
    }
    public set theta(val) {
        this._theta = val
        addRefreshParamsSystem(this)
    }

    private _segments?: number
    public get segments() {
        return this._segments ?? 32
    }
    public set segments(val) {
        this._segments = val
        addRefreshParamsSystem(this)
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
