import { SpotLight as ThreeSpotLight, SpotLightHelper } from "three"
import LightBase from "../core/LightBase"
import ISpotLight, {
    spotLightDefaults,
    spotLightSchema
} from "../../interface/ISpotLight"
import { SHADOW_BIAS } from "../../globals"
import { Reactive } from "@lincode/reactivity"
import mainCamera from "../../engine/mainCamera"
import scene from "../../engine/scene"
import { getCameraRendered } from "../../states/useCameraRendered"
import HelperSprite from "../core/utils/HelperSprite"
import { scaleDown } from "../../engine/constants"

export default class SpotLight
    extends LightBase<typeof ThreeSpotLight>
    implements ISpotLight
{
    public static componentName = "spotLight"
    public static defaults = spotLightDefaults
    public static schema = spotLightSchema

    public constructor() {
        super(ThreeSpotLight, SpotLightHelper)

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light) return

            light.shadow.bias = SHADOW_BIAS * 1.5
            scene.add(light.target)

            return () => {
                scene.remove(light.target)
            }
        }, [this.lightState.get])

        this.createEffect(() => {
            const light = this.lightState.get()
            if (getCameraRendered() !== mainCamera || !light) return

            const sprite = new HelperSprite("target")
            const handleX = this.targetXState.get((val) => {
                sprite.x = val
                light.target.position.x = val & scaleDown
            })
            const handleY = this.targetYState.get((val) => {
                sprite.y = val
                light.target.position.y = val & scaleDown
            })
            const handleZ = this.targetZState.get((val) => {
                sprite.z = val
                light.target.position.z = val & scaleDown
            })
            return () => {
                sprite.dispose()
                handleX.cancel()
                handleY.cancel()
                handleZ.cancel()
            }
        }, [getCameraRendered, this.lightState.get])
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

    private targetXState = new Reactive(0)
    public get targetX() {
        return this.targetXState.get()
    }
    public set targetX(val) {
        this.targetXState.set(val)
    }

    private targetYState = new Reactive(0)
    public get targetY() {
        return this.targetYState.get()
    }
    public set targetY(val) {
        this.targetYState.set(val)
    }

    private targetZState = new Reactive(0)
    public get targetZ() {
        return this.targetZState.get()
    }
    public set targetZ(val) {
        this.targetZState.set(val)
    }
}
