import { SpotLight as ThreeSpotLight, SpotLightHelper } from "three"
import LightBase from "../core/LightBase"
import ISpotLight, {
    spotLightDefaults,
    spotLightSchema
} from "../../interface/ISpotLight"
import { SHADOW_BIAS } from "../../globals"

export default class SpotLight
    extends LightBase<typeof ThreeSpotLight>
    implements ISpotLight
{
    public static componentName = "spotLight"
    public static defaults = spotLightDefaults
    public static schema = spotLightSchema

    public constructor() {
        super(ThreeSpotLight, SpotLightHelper)
        this.castShadow = true

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light) return

            light.shadow.bias = SHADOW_BIAS * 1.5
        }, [this.lightState.get])
    }

    public get angle() {
        const light = this.lightState.get()
        if (!light) return 1

        return light.angle
    }
    public set angle(val) {
        this.cancelHandle("angle", () =>
            this.lightState.get((light) => light && (light.angle = val))
        )
    }

    public get penumbra() {
        const light = this.lightState.get()
        if (!light) return 0

        return light.penumbra
    }
    public set penumbra(val) {
        this.cancelHandle("penumbra", () =>
            this.lightState.get((light) => light && (light.penumbra = val))
        )
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
