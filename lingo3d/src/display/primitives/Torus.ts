import { deg2Rad } from "@lincode/math"
import { TorusGeometry } from "three"
import { PI2 } from "../../globals"
import ITorus, { torusDefaults, torusSchema } from "../../interface/ITorus"
import ConfigurablePrimitive, {
    allocateDefaultInstance,
    refreshParamsSystem
} from "../core/ConfigurablePrimitive"

const defaultParams = <const>[0.5, 0.1, 16, 32, PI2]
const geometry = allocateDefaultInstance(TorusGeometry, defaultParams)

export default class Torus
    extends ConfigurablePrimitive<typeof TorusGeometry>
    implements ITorus
{
    public static componentName = "torus"
    public static override defaults = torusDefaults
    public static override schema = torusSchema

    public constructor() {
        super(TorusGeometry, defaultParams, geometry)
    }

    protected override getParams() {
        return <const>[
            0.5,
            this.thickness,
            16,
            this.segments,
            this.theta * deg2Rad
        ]
    }

    private _segments?: number
    public get segments() {
        return this._segments ?? 32
    }
    public set segments(val) {
        this._segments = val
        refreshParamsSystem(this)
    }

    private _thickness?: number
    public get thickness() {
        return this._thickness ?? 0.1
    }
    public set thickness(val) {
        this._thickness = val
        refreshParamsSystem(this)
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
