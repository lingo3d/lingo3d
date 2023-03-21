import { SpotLight as ThreeSpotLight, SpotLightHelper } from "three"
import LightBase from "../core/LightBase"
import ISpotLight, {
    spotLightDefaults,
    spotLightSchema
} from "../../interface/ISpotLight"
import { CM2M, M2CM, SHADOW_BIAS } from "../../globals"
import { deg2Rad, rad2Deg } from "@lincode/math"

export default class SpotLight
    extends LightBase<typeof ThreeSpotLight>
    implements ISpotLight
{
    public static componentName = "spotLight"
    public static defaults = spotLightDefaults
    public static schema = spotLightSchema

    public constructor() {
        super(ThreeSpotLight, SpotLightHelper)
        this.distance = 1000
        this.angle = 45

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light) return

            this.outerObject3d.add(light.target)
            light.position.y = 0
            light.target.position.y = -0.1
            light.shadow.bias = SHADOW_BIAS * 1.5

            return () => {
                this.outerObject3d.remove(light.target)
            }
        }, [this.lightState.get])
    }

    public get angle() {
        const light = this.lightState.get()
        if (!light) return 45

        return light.angle * rad2Deg
    }
    public set angle(val) {
        this.cancelHandle("angle", () =>
            this.lightState.get(
                (light) => light && (light.angle = val * deg2Rad)
            )
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
