import { deg2Rad } from "@lincode/math"
import { PI2 } from "../../globals"
import ITorus, { torusDefaults, torusSchema } from "../../interface/ITorus"
import { TorusParams, torusGeometryPool } from "../../pools/torusGeometryPool"
import PooledPrimitve from "../core/PooledPrimitive"
import toFixed from "../../api/serializer/toFixed"
import { refreshPooledPrimitiveSystem } from "../../systems/configSystems/refreshPooledPrimitiveSystem"

const geometry = torusGeometryPool.request([0.5, 0.1, 16, 32, PI2])

export default class Torus extends PooledPrimitve implements ITorus {
    public static componentName = "torus"
    public static override defaults = torusDefaults
    public static override schema = torusSchema

    public constructor() {
        super(geometry, torusGeometryPool)
    }

    public $getParams(): TorusParams {
        return [0.5, this.thickness, 16, this.segments, this.theta * deg2Rad]
    }

    private _segments?: number
    public get segments() {
        return this._segments ?? 32
    }
    public set segments(val) {
        this._segments = toFixed(val)
        refreshPooledPrimitiveSystem.add(this)
    }

    private _thickness?: number
    public get thickness() {
        return this._thickness ?? 0.1
    }
    public set thickness(val) {
        this._thickness = toFixed(val)
        refreshPooledPrimitiveSystem.add(this)
    }

    private _theta?: number
    public get theta() {
        return this._theta ?? 360
    }
    public set theta(val) {
        this._theta = toFixed(val)
        refreshPooledPrimitiveSystem.add(this)
    }
}
