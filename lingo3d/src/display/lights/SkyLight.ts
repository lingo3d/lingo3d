import ISkyLight, {
    skyLightDefaults,
    skyLightSchema
} from "../../interface/ISkyLight"
import { Reactive } from "@lincode/reactivity"
import { CSM } from "three/examples/jsm/csm/CSM"
import scene from "../../engine/scene"
import { getCameraRendered } from "../../states/useCameraRendered"
import DirectionalLight from "./DirectionalLight"
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
import { cameraRenderedPtr } from "../../pointers/cameraRenderedPtr"
import { Color } from "three"
import { ColorString } from "../../interface/ITexturedStandard"
import MeshAppendable from "../../api/core/MeshAppendable"

export default class SkyLight extends MeshAppendable implements ISkyLight {
    public static componentName = "skyLight"
    public static defaults = skyLightDefaults
    public static schema = skyLightSchema

    public constructor() {
        super()

        const backLight = new DirectionalLight()
        backLight.disableSceneGraph = true
        backLight.disableSerialize = true
        addSkyBackLightSystem(this, { backLight })

        const ambientLight = new AmbientLight()
        ambientLight.disableSceneGraph = true
        ambientLight.disableSerialize = true

        this.then(() => {
            deleteSkyBackLightSystem(this)
            backLight.dispose()
            ambientLight.dispose()
        })

        this.createEffect(() => {
            const intensity = this.intensityState.get()
            const color = this.colorState.get()

            updateBackLight(this, backLight)
            backLight.intensity = intensity * 0.25
            ambientLight.intensity = intensity * 0.25
            backLight.color = color
            ambientLight.color = color

            if (!this.shadowsState.get()) {
                const light = new DirectionalLight()
                light.disableSceneGraph = true
                light.disableSerialize = true
                light.intensity = intensity
                light.color = color
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
                camera: cameraRenderedPtr[0],
                lightIntensity: intensity
            })
            for (const light of csm.lights) light.color = new Color(color)
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
        }, [
            this.intensityState.get,
            this.colorState.get,
            this.shadowsState.get
        ])
    }

    private intensityState = new Reactive(1)
    public get intensity() {
        return this.intensityState.get()
    }
    public set intensity(val) {
        this.intensityState.set(Math.max(val, 0.1))
    }

    private colorState = new Reactive<ColorString>("#ffffff")
    public get color() {
        return this.colorState.get()
    }
    public set color(val) {
        this.colorState.set(val)
    }

    private shadowsState = new Reactive(true)
    public get shadows() {
        return this.shadowsState.get()
    }
    public set shadows(val) {
        this.shadowsState.set(val)
    }
}
