import ICircle, { circleDefaults, circleSchema } from "../../interface/ICircle"
import { PI2 } from "../../globals"
import {
    CircleParams,
    allocateDefaultCircleGeometry,
    decreaseCircleGeometry,
    increaseCircleGeometry
} from "../../pools/circleGeometryPool"
import { deg2Rad } from "@lincode/math"
import PooledPrimitve from "../core/PooledPrimitive"
import { addRefreshPooledPrimitiveSystem } from "../../systems/configSystems/refreshPooledPrimitiveSystem"

const defaultParams: CircleParams = [0.5, 32, 0, PI2]
const defaultParamString = JSON.stringify(defaultParams)
const geometry = allocateDefaultCircleGeometry(defaultParams)

export default class Circle extends PooledPrimitve implements ICircle {
    public static componentName = "circle"
    public static override defaults = circleDefaults
    public static override schema = circleSchema

    public constructor() {
        super(
            geometry,
            defaultParamString,
            decreaseCircleGeometry,
            increaseCircleGeometry
        )
        this.object3d.scale.z = Number.EPSILON
    }

    public getParams(): CircleParams {
        return [0.5, this.segments, 0, this.theta * deg2Rad]
    }

    private _theta?: number
    public get theta() {
        return this._theta ?? 360
    }
    public set theta(val) {
        this._theta = val
        addRefreshPooledPrimitiveSystem(this)
    }

    private _segments?: number
    public get segments() {
        return this._segments ?? 32
    }
    public set segments(val) {
        this._segments = val
        addRefreshPooledPrimitiveSystem(this)
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
