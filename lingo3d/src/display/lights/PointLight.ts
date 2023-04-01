import { PointLight as ThreePointLight } from "three"
import { CM2M, M2CM } from "../../globals"
import IPointLight, {
    pointLightDefaults,
    pointLightSchema
} from "../../interface/IPointLight"
import LightBase from "../core/LightBase"

export default class PointLight
    extends LightBase<ThreePointLight>
    implements IPointLight
{
    public static componentName = "pointLight"
    public static defaults = pointLightDefaults
    public static schema = pointLightSchema

    protected override shadowBiasCoeff = 0.15

    public constructor() {
        super(new ThreePointLight())
        this.distance = 1000
    }

    public get decay() {
        return this.object3d.decay
    }
    public set decay(val) {
        this.object3d.decay = val
    }

    public get distance() {
        return this.object3d.distance * M2CM
    }
    public set distance(val) {
        this.object3d.distance = val * CM2M
    }
}
