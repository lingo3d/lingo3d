import { mapRange } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import { assertExhaustive } from "@lincode/utils"
import {
    DirectionalLight as ThreeDirectionalLight,
    PerspectiveCamera
} from "three"
import { getManager } from "../../api/utils/getManager"
import scene from "../../engine/scene"
import { SHADOW_BIAS } from "../../globals"
import IDirectionalLight, {
    directionalLightDefaults,
    directionalLightSchema
} from "../../interface/IDirectionalLight"
import { getCameraRendered } from "../../states/useCameraRendered"
import {
    getShadowDistance,
    ShadowDistance
} from "../../states/useShadowDistance"
import { getShadowResolution } from "../../states/useShadowResolution"
import renderSystemWithData from "../../utils/renderSystemWithData"
import Camera from "../cameras/Camera"
import LightBase, { mapShadowResolution } from "../core/LightBase"
import getWorldPosition from "../utils/getWorldPosition"
import { vec2Point } from "../utils/vec2Point"

const mapShadowDistance = (val: ShadowDistance) => {
    switch (val) {
        case "near":
            return 1000
        case "medium":
            return 3000
        case "far":
            return 10000
        default:
            assertExhaustive(val)
    }
}

const [addLightSystem, deleteLightSystem] = renderSystemWithData(
    (
        self: DirectionalLight,
        data: { light: ThreeDirectionalLight; cam: PerspectiveCamera }
    ) => {
        const camPos = getWorldPosition(data.cam)
        const lightPos = getWorldPosition(self.outerObject3d)
        data.light.position.copy(camPos).add(lightPos)
        data.light.target.position.copy(camPos).sub(lightPos)
    }
)

export default class DirectionalLight
    extends LightBase<typeof ThreeDirectionalLight>
    implements IDirectionalLight
{
    public static componentName = "directionalLight"
    public static defaults = directionalLightDefaults
    public static schema = directionalLightSchema

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
            const light = this.lightState.get()
            if (!light) return

            const camManager = getManager<Camera>(getCameraRendered())
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
            shadowCamera.zoom =
                500 /
                offset /
                mapShadowDistance(
                    this.shadowDistanceState.get() ?? getShadowDistance()
                )
            shadowCamera.updateProjectionMatrix()
            light.shadow.mapSize.setScalar(
                mapShadowResolution(
                    this.shadowResolutionState.get() ?? getShadowResolution()
                )
            )
        }, [
            this.lightState.get,
            this.shadowDistanceState.get,
            getShadowDistance,
            getCameraRendered
        ])

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light) return

            addLightSystem(this, { light, cam: getCameraRendered() })
            return () => {
                deleteLightSystem(this)
            }
        }, [getCameraRendered, this.lightState.get])

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light) return

            light.shadow.bias =
                SHADOW_BIAS *
                mapRange(
                    mapShadowDistance(
                        this.shadowDistanceState.get() ?? getShadowDistance()
                    ),
                    3000,
                    10000,
                    0.05,
                    0.15
                ) *
                mapRange(
                    mapShadowResolution(
                        this.shadowResolutionState.get() ??
                            getShadowResolution()
                    ),
                    1024,
                    256,
                    1,
                    4,
                    true
                )
        }, [
            this.lightState.get,
            this.shadowDistanceState.get,
            getShadowDistance,
            this.shadowResolutionState.get,
            getShadowResolution
        ])
    }

    public override getWorldPosition() {
        return vec2Point(getWorldPosition(this.outerObject3d))
    }

    private shadowDistanceState = new Reactive<ShadowDistance | undefined>(
        undefined
    )
    public get shadowDistance() {
        return this.shadowDistanceState.get()
    }
    public set shadowDistance(val) {
        this.shadowDistanceState.set(val)
    }
}
