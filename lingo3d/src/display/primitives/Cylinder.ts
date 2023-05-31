import toFixed from "../../api/serializer/toFixed"
import { PI2 } from "../../globals"
import ICylinder, {
    cylinderDefaults,
    cylinderSchema
} from "../../interface/ICylinder"
import {
    CylinderParams,
    releaseCylinderGeometry,
    requestCylinderGeometry
} from "../../pools/cylinderGeometryPool"
import { refreshPooledPrimitiveSystem } from "../../systems/configSystems/refreshPooledPrimitiveSystem"
import PooledPrimitve from "../core/PooledPrimitive"

export const cylinderGeometry = requestCylinderGeometry([
    0.5,
    0.5,
    1,
    32,
    1,
    false,
    0,
    PI2
])

export default class Cylinder extends PooledPrimitve implements ICylinder {
    public static componentName = "cylinder"
    public static override defaults = cylinderDefaults
    public static override schema = cylinderSchema

    public constructor() {
        super(
            cylinderGeometry,
            releaseCylinderGeometry,
            requestCylinderGeometry
        )
    }

    public $getParams(): CylinderParams {
        return [
            this.radiusTop,
            this.radiusBottom,
            1,
            this.segments,
            1,
            false,
            0,
            PI2
        ]
    }

    private _segments?: number
    public get segments() {
        return this._segments ?? 32
    }
    public set segments(val) {
        this._segments = toFixed(val)
        refreshPooledPrimitiveSystem.add(this)
    }

    private _radiusTop?: number
    public get radiusTop() {
        return this._radiusTop ?? 0.5
    }
    public set radiusTop(val) {
        this._radiusTop = toFixed(val)
        refreshPooledPrimitiveSystem.add(this)
    }

    private _radiusBottom?: number
    public get radiusBottom() {
        return this._radiusBottom ?? 0.5
    }
    public set radiusBottom(val) {
        this._radiusBottom = toFixed(val)
        refreshPooledPrimitiveSystem.add(this)
    }
}
