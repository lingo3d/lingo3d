import { Reactive } from "@lincode/reactivity"
import { mapRange } from "@tweakpane/core"
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
            scene.attach(light)

            return () => {
                scene.remove(light.target)
                scene.remove(light)
            }
        }, [this.lightState.get])

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light) return

            const camManager = getCameraRendered().userData.manager
            const offset = camManager
                ? Math.max(
                      mapRange(
                          camManager.innerZ *
                              (camManager.fov / 75) *
                              (1 / camManager.zoom),
                          500,
                          1000,
                          1,
                          1.5
                      ),
                      1
                  )
                : 1

            const shadowDistance =
                this.shadowDistanceState.get() ?? getShadowDistance() ?? 2000

            const shadowCamera = light.shadow.camera
            shadowCamera.zoom = 500 / offset / shadowDistance
            shadowCamera.updateProjectionMatrix()

            const shadowBiasComputed = this.shadowBiasComputedState.get()
            const shadowResolutionComputed =
                this.shadowResolutionComputedState.get()

            if (!shadowBiasComputed || !shadowResolutionComputed) return

            const shadowBias = shadowBiasComputed
            light.shadow.bias =
                shadowBias *
                offset *
                (this.defaultShadowResolution / shadowResolutionComputed) *
                (shadowDistance / 2000)

            return () => {
                light.shadow.bias = shadowBias
            }
        }, [
            this.lightState.get,
            this.shadowDistanceState.get,
            getShadowDistance,
            getCameraRendered,
            this.shadowBiasComputedState.get,
            this.shadowResolutionComputedState.get
        ])

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light) return

            const cam = getCameraRendered()

            const handle = onBeforeRender(() => {
                const camPos = getWorldPosition(cam)
                const lightPos = getWorldPosition(this.outerObject3d)
                light.position.copy(camPos).add(lightPos)
                light.target.position.copy(camPos).sub(lightPos)
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
