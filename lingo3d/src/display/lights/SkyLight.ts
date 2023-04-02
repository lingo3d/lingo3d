import ISkyLight, {
    skyLightDefaults,
    skyLightSchema
} from "../../interface/ISkyLight"
import { Reactive } from "@lincode/reactivity"
import { CSM } from "three/examples/jsm/csm/CSM"
import scene from "../../engine/scene"
import { getCameraRendered } from "../../states/useCameraRendered"
import DirectionalLight from "./DirectionalLight"
import SimpleObjectManager from "../core/SimpleObjectManager"
import AmbientLight from "./AmbientLight"
import {
    updateLightDirection,
    addSkyLightSystem,
    deleteSkyLightSystem
} from "../../systems/skyLightSystem"
import {
    addSkyBackLightSystem,
    deleteSkyBackLightSystem,
    updateBackLight
} from "../../systems/skyBackLightSystem"
import { eraseAppendable } from "../utils/eraseAppendable"

export default class SkyLight extends SimpleObjectManager implements ISkyLight {
    public static componentName = "skyLight"
    public static defaults = skyLightDefaults
    public static schema = skyLightSchema

    public constructor() {
        super()

        const backLight = new DirectionalLight()
        backLight.helper = false
        eraseAppendable(backLight)
        addSkyBackLightSystem(this, { backLight })

        const ambientLight = new AmbientLight()
        ambientLight.helper = false
        eraseAppendable(ambientLight)

        this.then(() => {
            deleteSkyBackLightSystem(this)
            backLight.dispose()
            ambientLight.dispose()
        })

        this.createEffect(() => {
            const intensity = this.intensityState.get()

            updateBackLight(this, backLight)
            backLight.intensity = intensity * 0.25
            ambientLight.intensity = intensity * 0.25

            if (!this.castShadowState.get()) {
                const light = new DirectionalLight()
                eraseAppendable(light)
                light.intensity = intensity
                this.append(light)
                return () => {
                    light.dispose()
                }
            }
            const csm = new CSM({
                maxFar: 50,
                shadowMapSize: 2048,
                shadowBias: -0.0002,
                cascades: 1,
                parent: scene,
                camera: getCameraRendered(),
                lightIntensity: intensity
            })
            updateLightDirection(this, csm)

            addSkyLightSystem(csm, { self: this })
            const handle = getCameraRendered((val) => (csm.camera = val))
            return () => {
                deleteSkyLightSystem(csm)
                handle.cancel()
                csm.dispose()
                for (const light of csm.lights) {
                    light.dispose()
                    scene.remove(light)
                }
            }
        }, [this.intensityState.get, this.castShadowState.get])
    }

    private intensityState = new Reactive(1)
    public get intensity() {
        return this.intensityState.get()
    }
    public set intensity(val) {
        this.intensityState.set(Math.max(val, 0.1))
    }

    private castShadowState = new Reactive(true)
    public get castShadow() {
        return this.castShadowState.get()
    }
    public set castShadow(val) {
        this.castShadowState.set(val)
    }
}
