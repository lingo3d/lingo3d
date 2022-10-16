import { mapRange } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import { assertExhaustive } from "@lincode/utils"
import { DirectionalLight as ThreeDirectionalLight } from "three"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import { SHADOW_BIAS } from "../../globals"
import IDirectionalLight, {
    directionalLightDefaults,
    directionalLightSchema
} from "../../interface/IDirectionalLight"
import { ShadowResolution } from "../../interface/ILightBase"
import { ShadowDistance } from "../../interface/ISkyLight"
import { getCameraRendered } from "../../states/useCameraRendered"
import LightBase from "../core/LightBase"
import getWorldPosition from "../utils/getWorldPosition"
import { vec2Point } from "../utils/vec2Point"

const mapShadowResolution = (val: ShadowResolution) => {
    switch (val) {
        case "low":
            return 512
        case "medium":
            return 1024
        case "high":
            return 2048
        default:
            assertExhaustive(val)
    }
}

export default class DirectionalLight
    extends LightBase<typeof ThreeDirectionalLight>
    implements IDirectionalLight
{
    public static componentName = "directionalLight"
    public static defaults = directionalLightDefaults
    public static schema = directionalLightSchema

    public constructor() {
        super(ThreeDirectionalLight)
        this.shadowResolution = "medium"

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light) return

            scene.add(light.target)

            return () => {
                scene.remove(light.target)
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

            const shadowDistance = this.shadowDistanceState.get()
            const maxFar = (() => {
                if (shadowDistance === "middle") return 3000
                if (shadowDistance === "near") return 1000
                return 10000
            })()
            const shadowCamera = light.shadow.camera
            shadowCamera.zoom = 500 / offset / maxFar
            shadowCamera.updateProjectionMatrix()
            light.shadow.mapSize.setScalar(
                mapShadowResolution(this.shadowResolutionState.get())
            )
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

            const shadowDistance = this.shadowDistanceState.get()
            const maxFar = (() => {
                if (shadowDistance === "middle") return 3000
                if (shadowDistance === "near") return 1000
                return 10000
            })()
            light.shadow.bias =
                SHADOW_BIAS *
                mapRange(maxFar, 3000, 10000, 0.05, 0.15) *
                mapRange(
                    mapShadowResolution(this.shadowResolutionState.get()),
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

    private shadowDistanceState = new Reactive<ShadowDistance>("middle")
    public get shadowDistance() {
        return this.shadowDistanceState.get()
    }
    public set shadowDistance(val) {
        this.shadowDistanceState.set(val)
    }
}
