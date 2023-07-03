import ICurve, { curveDefaults, curveSchema } from "../interface/ICurve"
import MeshAppendable from "./core/MeshAppendable"
import { Point3dType } from "../typeGuards/isPoint"
import { BufferGeometry, Line, LineBasicMaterial } from "three"
import { configCurveSystem } from "../systems/configSystems/configCurveSystem"

export default class Curve extends MeshAppendable implements ICurve {
    public static componentName = "curve"
    public static defaults = curveDefaults
    public static schema = curveSchema

    public $geometry: BufferGeometry | undefined
    public $material: LineBasicMaterial | undefined
    public $mesh: Line | undefined

    private _helper = false
    public get helper() {
        return this._helper
    }
    public set helper(val) {
        this._helper = val
        configCurveSystem.add(this)
    }

    private _subdivide = 3
    public get subdivide() {
        return this._subdivide
    }
    public set subdivide(val) {
        this._subdivide = val
        configCurveSystem.add(this)
    }

    private _points: Array<Point3dType> = []
    public get points() {
        return this._points
    }
    public set points(val) {
        this._points = val
        configCurveSystem.add(this)
    }

    public addPoint(pt: Point3dType) {
        this._points.push(pt)
        configCurveSystem.add(this)
    }
}
