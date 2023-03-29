import { PI2 } from "../../globals"
import ICone, { coneDefaults, coneSchema } from "../../interface/ICone"
import {
    allocateDefaultConeGeometry,
    decreaseConeGeometry,
    increaseConeGeometry
} from "../../pools/coneGeometryPool"
import { addRefreshPooledPrimitiveSystem } from "../../systems/autoClear/refreshPooledPrimitiveSystem"
import PooledPrimitve from "../core/PooledPrimitive"

const defaultParams = <const>[0.5, 1, 32, 1, false, 0, PI2]
const defaultParamString = JSON.stringify(defaultParams)
const geometry = allocateDefaultConeGeometry(defaultParams)

export default class Cone extends PooledPrimitve implements ICone {
    public static componentName = "cone"
    public static override defaults = coneDefaults
    public static override schema = coneSchema

    public constructor() {
        super(
            geometry,
            defaultParamString,
            decreaseConeGeometry,
            increaseConeGeometry
        )
    }

    public getParams() {
        return <const>[0.5, 1, this.segments, 1, false, 0, PI2]
    }

    private _segments?: number
    public get segments() {
        return this._segments ?? 32
    }
    public set segments(val) {
        this._segments = val
        addRefreshPooledPrimitiveSystem(this)
    }
}
