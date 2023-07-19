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
import { cameraRenderedPtr } from "../../pointers/cameraRenderedPtr"
import { ColorString } from "../../interface/ITexturedStandard"
import MeshAppendable from "../core/MeshAppendable"
import { skyLightSystem } from "../../systems/skyLightSystem"
import { skyLightPtr } from "../../pointers/skyLightPtr"

export default class SkyLight extends MeshAppendable implements ISkyLight {
    public static componentName = "skyLight"
    public static defaults = skyLightDefaults
    public static schema = skyLightSchema

    public $backLight: DirectionalLight
    public $csm?: CSM
    private _ambientLight: AmbientLight

    public constructor() {
        super()
        skyLightPtr[0] = this
        skyLightSystem.add(this)

        const backLight = (this.$backLight = new DirectionalLight())
        backLight.remove()

        const ambientLight = (this._ambientLight = new AmbientLight())
        ambientLight.remove()

        this.createEffect(() => {
            const intensity = this.intensityState.get()
            const color = this.colorState.get()

            backLight.intensity = intensity * 0.25
            ambientLight.intensity = intensity * 0.25
            backLight.color = color
            ambientLight.color = color

            if (!this.shadowsState.get()) {
                const light = new DirectionalLight()
                light.remove()
                light.intensity = intensity
                light.color = color
                this.append(light)
                return () => {
                    light.dispose()
                }
            }
            const csm = (this.$csm = new CSM({
                maxFar: 50,
                shadowMapSize: 2048,
                shadowBias: -0.0002,
                cascades: 1,
                parent: scene,
                camera: cameraRenderedPtr[0],
                lightIntensity: intensity
            }))
            for (const light of csm.lights) light.color.set(color)

            const handle = getCameraRendered((val) => (csm.camera = val))
            return () => {
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

    protected override disposeNode() {
        super.disposeNode()
        this.$backLight.dispose()
        this._ambientLight.dispose()
        skyLightPtr[0] = undefined
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
