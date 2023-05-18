import ICurve, { curveDefaults, curveSchema } from "../interface/ICurve"
import MeshAppendable from "./core/MeshAppendable"
import { getEditorHelper } from "../states/useEditorHelper"
import { Point3dType } from "../utils/isPoint"
import { addConfigCurveSystem } from "../systems/configSystems/configCurveSystem"
import { BufferGeometry, Line, LineBasicMaterial } from "three"

export default class Curve extends MeshAppendable implements ICurve {
    public static componentName = "curve"
    public static defaults = curveDefaults
    public static schema = curveSchema

    public constructor() {
        super()

        this.createEffect(() => {
            const helpers = createFor(
                this.helperState.get() && getEditorHelper() ? this._points : [],
                (pt, cleanup) => {
                    return helper
                }
            )
            for (const [point, helper] of helpers) Object.assign(helper, point)
        }, [getEditorHelper])
    }

    public $geometry: BufferGeometry | undefined
    public $material: LineBasicMaterial | undefined
    public $mesh: Line | undefined

    private _helper = false
    public get helper() {
        return this._helper
    }
    public set helper(val) {
        this._helper = val
        addConfigCurveSystem(this)
    }

    private _subdivide = 3
    public get subdivide() {
        return this._subdivide
    }
    public set subdivide(val) {
        this._subdivide = val
        addConfigCurveSystem(this)
    }

    private _points: Array<Point3dType> = []
    public get points() {
        return this._points
    }
    public set points(val) {
        this._points = val
        addConfigCurveSystem(this)
    }

    public addPoint(pt: Point3dType) {
        this._points.push(pt)
        addConfigCurveSystem(this)
    }
}
