import { Reactive } from "@lincode/reactivity"
import { DirectionalLight as ThreeDirectionalLight } from "three"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import IDirectionalLight, {
    directionalLightDefaults,
    directionalLightSchema
} from "../../interface/IDirectionalLight"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getShadowDistance } from "../../states/useShadowDistance"
import LightBase from "../core/LightBase"
import getWorldPosition from "../utils/getWorldPosition"
import { vec2Point } from "../utils/vec2Point"

export default class DirectionalLight
    extends LightBase<typeof ThreeDirectionalLight>
    implements IDirectionalLight
{
    public static componentName = "directionalLight"
    public static defaults = directionalLightDefaults
    public static schema = directionalLightSchema

    protected override defaultShadowResolution = 1024

    public constructor() {
        super(ThreeDirectionalLight)

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light) return

            scene.add(light.target)

            return () => {
                scene.remove(light.target)
            }
        }, [this.lightState.get])

        this.createEffect(() => {
            const shadowCamera = this.lightState.get()?.shadow.camera
            if (!shadowCamera) return

            shadowCamera.zoom =
                500 /
                (this.shadowDistanceState.get() ?? getShadowDistance() ?? 2000)
            shadowCamera.updateProjectionMatrix()
        }, [
            this.lightState.get,
            this.shadowDistanceState.get,
            getShadowDistance
        ])

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light) return

            const cam = getCameraRendered()
            const handle = onBeforeRender(() => {
                const position = getWorldPosition(cam)
                light.position.copy(position).add(this.outerObject3d.position)
                light.target.position
                    .copy(position)
                    .sub(this.outerObject3d.position)
            })
            return () => {
                handle.cancel()
            }
        }, [getCameraRendered, this.lightState.get])
    }

    public override getWorldPosition() {
        return vec2Point(getWorldPosition(this.outerObject3d))
    }

    private shadowDistanceState = new Reactive<number | undefined>(undefined)
    public get shadowDistance() {
        return this.shadowDistanceState.get()
    }
    public set shadowDistance(val) {
        this.shadowDistanceState.set(val)
    }
}
