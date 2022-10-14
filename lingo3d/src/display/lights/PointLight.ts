import { PointLight as ThreePointLight } from "three"
import { SHADOW_BIAS } from "../../globals"
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
        if (!light) return 0

        return light.distance
    }
    public set distance(val) {
        this.cancelHandle("distance", () =>
            this.lightState.get((light) => light && (light.distance = val))
        )
    }
}
