import { PI2 } from "../../globals"
import ICylinder, {
    cylinderDefaults,
    cylinderSchema
} from "../../interface/ICylinder"
import {
    allocateDefaultCylinderGeometry,
    decreaseCylinderGeometry,
    increaseCylinderGeometry
} from "../../pools/cylinderGeometryPool"
import { addRefreshPooledPrimitiveSystem } from "../../systems/autoClear/refreshPooledPrimitiveSystem"
import PooledPrimitve from "../core/PooledPrimitive"

const defaultParams = <const>[0.5, 0.5, 1, 32, 1, false, 0, PI2]
const defaultParamString = JSON.stringify(defaultParams)
export const cylinderGeometry = allocateDefaultCylinderGeometry(defaultParams)

export default class Cylinder extends PooledPrimitve implements ICylinder {
    public static componentName = "cylinder"
    public static override defaults = cylinderDefaults
    public static override schema = cylinderSchema

    public constructor() {
        super(
            cylinderGeometry,
            defaultParamString,
            decreaseCylinderGeometry,
            increaseCylinderGeometry
        )
    }

    public getParams() {
        return <const>[
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
        this._segments = val
        addRefreshPooledPrimitiveSystem(this)
    }

    private _radiusTop?: number
    public get radiusTop() {
        return this._radiusTop ?? 0.5
    }
    public set radiusTop(val) {
        this._radiusTop = val
        addRefreshPooledPrimitiveSystem(this)
    }

    private _radiusBottom?: number
    public get radiusBottom() {
        return this._radiusBottom ?? 0.5
    }
    public set radiusBottom(val) {
        this._radiusBottom = val
        addRefreshPooledPrimitiveSystem(this)
    }
}
