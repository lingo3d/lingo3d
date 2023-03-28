import { ConeGeometry } from "three"
import { PI2 } from "../../globals"
import ICone, { coneDefaults, coneSchema } from "../../interface/ICone"
import ConfigurablePrimitive, {
    allocateDefaultInstance,
    addRefreshParamsSystem
} from "../core/ConfigurablePrimitive"

const defaultParams = <const>[0.5, 1, 32, 1, false, 0, PI2]
const geometry = allocateDefaultInstance(
    ConeGeometry,
    defaultParams
) as ConeGeometry

export default class Cone
    extends ConfigurablePrimitive<typeof ConeGeometry>
    implements ICone
{
    public static componentName = "cone"
    public static override defaults = coneDefaults
    public static override schema = coneSchema

    public constructor() {
        super(ConeGeometry, defaultParams, geometry)
    }

    public override getParams() {
        return <const>[0.5, 1, this.segments, 1, false, 0, PI2]
    }

    private _segments?: number
    public get segments() {
        return this._segments ?? 32
    }
    public set segments(val) {
        this._segments = val
        addRefreshParamsSystem(this)
    }
}
