import { mapShadowResolution } from "../core/LightBase"
import ISkyLight, {
    skyLightDefaults,
    skyLightSchema
} from "../../interface/ISkyLight"
import { Reactive } from "@lincode/reactivity"
import { CSM } from "three/examples/jsm/csm/CSM"
import scene from "../../engine/scene"
import { getCameraRendered } from "../../states/useCameraRendered"
import {
    getShadowDistance,
    ShadowDistance
} from "../../states/useShadowDistance"
import {
    getShadowResolution,
    ShadowResolution
} from "../../states/useShadowResolution"
import DirectionalLight from "./DirectionalLight"
import { eraseAppendable } from "../../api/core/collections"
import { assertExhaustive } from "@lincode/utils"
import renderSystemWithData from "../../utils/renderSystemWithData"
import { positionChanged } from "../utils/trackObject"
import { vector3 } from "../utils/reusables"
import ObjectManager from "../core/ObjectManager"
import AmbientLight from "./AmbientLight"

const updateLightDirection = (self: SkyLight, csm: CSM) =>
    (csm.lightDirection = self.position.clone().normalize().multiplyScalar(-1))

const [addLightSystem, deleteLightSystem] = renderSystemWithData(
    (self: SkyLight, data: { csm: CSM }) => {
        positionChanged(self.outerObject3d) &&
            updateLightDirection(self, data.csm)
        data.csm.update()
    }
)

const updateBackLight = (self: SkyLight, backLight: DirectionalLight) => {
    backLight.position.copy(
        self.position.clone().multiply(vector3.set(-1, 1, -1))
    )
}
const [addBackLightSystem, deleteBackLightSystem] = renderSystemWithData(
    (self: SkyLight, data: { backLight: DirectionalLight }) =>
        positionChanged(self.outerObject3d) &&
        updateBackLight(self, data.backLight)
)

const mapCSMOptions = (
    shadowDistance: ShadowDistance,
    shadowResolution: ShadowResolution
) => {
    switch (shadowDistance) {
        case "near":
            return {
                maxFar: 10,
                shadowMapSize: mapShadowResolution(shadowResolution) * 2,
                shadowBias: -0.00003
            }
        case "medium":
            return {
                maxFar: 30,
                shadowMapSize: mapShadowResolution(shadowResolution) * 2,
                shadowBias: -0.0001
            }
        case "far":
            return {
                maxFar: 100,
                shadowMapSize: mapShadowResolution(shadowResolution) * 2,
                shadowBias: -0.0001
            }
        default:
            assertExhaustive(shadowDistance)
    }
}

export default class SkyLight extends ObjectManager implements ISkyLight {
    public static componentName = "skyLight"
    public static defaults = skyLightDefaults
    public static schema = skyLightSchema

    public constructor() {
        super()

        const backLight = new DirectionalLight()
        backLight.helper = false
        backLight.intensity = 0.25
        eraseAppendable(backLight)
        addBackLightSystem(this, { backLight })

        const ambientLight = new AmbientLight()
        ambientLight.helper = false
        ambientLight.intensity = 0.25
        eraseAppendable(ambientLight)

        this.then(() => {
            deleteBackLightSystem(this)
            backLight.dispose()
            ambientLight.dispose()
        })

        this.createEffect(() => {
            const intensity = this.intensityState.get()
            const csm = new CSM({
                ...mapCSMOptions(getShadowDistance(), getShadowResolution()),
                cascades: 1,
                parent: scene,
                camera: getCameraRendered(),
                lightIntensity: Math.max(0.1, intensity)
            })
            updateLightDirection(this, csm)
            updateBackLight(this, backLight)

            addLightSystem(this, { csm })
            const handle = getCameraRendered((val) => (csm.camera = val))
            return () => {
                deleteLightSystem(this)
                handle.cancel()
                csm.dispose()
                for (const light of csm.lights) {
                    light.dispose()
                    scene.remove(light)
                }
            }
        }, [this.intensityState.get, getShadowDistance, getShadowResolution])
    }

    private intensityState = new Reactive(1)
    public get intensity() {
        return this.intensityState.get()
    }
    public set intensity(val) {
        this.intensityState.set(val)
    }
}
