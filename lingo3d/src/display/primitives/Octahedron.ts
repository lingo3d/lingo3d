import { OctahedronGeometry } from "three"
import IOctahedron, {
    octahedronDefaults,
    octahedronSchema
} from "../../interface/IOctahedron"
import ConfigurablePrimitive, {
    allocateDefaultInstance,
    refreshParamsSystem
} from "../core/ConfigurablePrimitive"

const defaultParams = <const>[0.5, 0]
const geometry = allocateDefaultInstance(OctahedronGeometry, defaultParams)

export default class Octahedron
    extends ConfigurablePrimitive<typeof OctahedronGeometry>
    implements IOctahedron
{
    public static componentName = "octahedron"
    public static override defaults = octahedronDefaults
    public static override schema = octahedronSchema

    public constructor() {
        super(OctahedronGeometry, defaultParams, geometry)
    }

    protected override getParams() {
        return <const>[0.5, this.detail]
    }

    private _detail?: number
    public get detail() {
        return this._detail ?? 0
    }
    public set detail(val) {
        this._detail = val
        refreshParamsSystem(this)
    }
}
