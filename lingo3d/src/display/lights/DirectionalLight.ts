import { mapRange } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import { DirectionalLight as ThreeDirectionalLight } from "three"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import { SHADOW_BIAS, SHADOW_DISTANCE } from "../../globals"
import IDirectionalLight, {
    directionalLightDefaults,
    directionalLightSchema
} from "../../interface/IDirectionalLight"
import { getCameraRendered } from "../../states/useCameraRendered"
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

    public constructor() {
        super(ThreeDirectionalLight)
        this.castShadow = true
        this.shadowResolution = 1024

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

            const shadowCamera = light.shadow.camera
            shadowCamera.zoom = 500 / offset / this.shadowDistanceState.get()
            shadowCamera.updateProjectionMatrix()
        }, [
            this.lightState.get,
            this.shadowDistanceState.get,
            getCameraRendered
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

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light) return

            light.shadow.bias =
                SHADOW_BIAS *
                mapRange(
                    this.shadowDistanceState.get(),
                    3000,
                    10000,
                    0.05,
                    0.15
                ) *
                mapRange(
                    this.shadowResolutionState.get(),
                    1024,
                    256,
                    1,
                    4,
                    true
                )
        }, [
            this.lightState.get,
            this.shadowDistanceState.get,
            this.shadowResolutionState.get
        ])
    }

    public override getWorldPosition() {
        return vec2Point(getWorldPosition(this.outerObject3d))
    }

    private shadowDistanceState = new Reactive(SHADOW_DISTANCE)
    public get shadowDistance() {
        return this.shadowDistanceState.get()
    }
    public set shadowDistance(val) {
        this.shadowDistanceState.set(val)
    }
}
