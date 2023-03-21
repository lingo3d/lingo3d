import { PointLight as ThreePointLight } from "three"
import { CM2M, M2CM, SHADOW_BIAS } from "../../globals"
import IPointLight, {
    pointLightDefaults,
    pointLightSchema
} from "../../interface/IPointLight"
import LightBase from "../core/LightBase"

export default class PointLight
    extends LightBase<typeof ThreePointLight>
    implements IPointLight
{
    public static componentName = "pointLight"
    public static defaults = pointLightDefaults
    public static schema = pointLightSchema

    public constructor() {
        super(ThreePointLight)
        this.distance = 1000

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light) return

            light.shadow.bias = SHADOW_BIAS * 0.15
        }, [this.lightState.get])
    }

    public get decay() {
        const light = this.lightState.get()
        if (!light) return 1

        return light.decay
    }
    public set decay(val) {
        this.cancelHandle("decay", () =>
            this.lightState.get((light) => light && (light.decay = val))
        )
    }

    public get distance() {
        const light = this.lightState.get()
        if (!light) return 1000

        return light.distance * M2CM
    }
    public set distance(val) {
        this.cancelHandle("distance", () =>
            this.lightState.get(
                (light) => light && (light.distance = val * CM2M)
            )
        )
    }
}
