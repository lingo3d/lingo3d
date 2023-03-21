import { SpotLight as ThreeSpotLight, SpotLightHelper } from "three"
import LightBase from "../core/LightBase"
import ISpotLight, {
    spotLightDefaults,
    spotLightSchema
} from "../../interface/ISpotLight"
import { CM2M, M2CM, SHADOW_BIAS } from "../../globals"
import mainCamera from "../../engine/mainCamera"
import { getCameraRendered } from "../../states/useCameraRendered"
import HelperSprite from "../core/utils/HelperSprite"
import { deg2Rad, rad2Deg } from "@lincode/math"

export default class SpotLight
    extends LightBase<typeof ThreeSpotLight>
    implements ISpotLight
{
    public static componentName = "spotLight"
    public static defaults = spotLightDefaults
    public static schema = spotLightSchema

    private targetSprite = new HelperSprite("target")

    public constructor() {
        super(ThreeSpotLight, SpotLightHelper)
        this.distance = 1000
        this.angle = 45

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light) return

            light.shadow.bias = SHADOW_BIAS * 1.5
            light.position.y = -0.01
            this.targetSprite.outerObject3d.add(light.target)

            return () => {
                this.targetSprite.outerObject3d.remove(light.target)
            }
        }, [this.lightState.get])

        this.targetSprite.scale = 0.25
        this.watch(
            getCameraRendered(
                (cam) => (this.targetSprite.visible = cam === mainCamera)
            )
        )
        this.then(() => this.targetSprite.dispose())
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

    public get targetX() {
        return this.targetSprite.x
    }
    public set targetX(val) {
        this.targetSprite.x = val
    }

    public get targetY() {
        return this.targetSprite.y
    }
    public set targetY(val) {
        this.targetSprite.y = val
    }

    public get targetZ() {
        return this.targetSprite.z
    }
    public set targetZ(val) {
        this.targetSprite.z = val
    }
}
