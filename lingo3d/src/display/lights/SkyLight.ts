import { Color, HemisphereLight } from "three"
import LightBase from "../core/LightBase"
import ISkyLight, {
    skyLightDefaults,
    skyLightSchema
} from "../../interface/ISkyLight"
import { Reactive } from "@lincode/reactivity"
import DirectionalLight from "./DirectionalLight"

export default class Skylight
    extends LightBase<typeof HemisphereLight>
    implements ISkyLight
{
    public static componentName = "skyLight"
    public static defaults = skyLightDefaults
    public static schema = skyLightSchema

    public constructor() {
        super(HemisphereLight)
        this.innerY = 0

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light) return

            light.groundColor = new Color(this.groundColorState.get())
        }, [this.lightState.get, this.groundColorState.get])

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light || !this.sunState.get()) return

            const sunLight = new DirectionalLight()
            this.append(sunLight)
            sunLight.castShadow = true

            const handle0 = this.sunIntensityState.get(
                (intensity) => (sunLight.intensity = intensity)
            )
            const handle1 = this.sunColorState.get(
                (color) => (sunLight.color = color)
            )
            sunLight.helper = false

            return () => {
                sunLight.dispose()
                handle0.cancel()
                handle1.cancel()
            }
        }, [this.lightState.get, this.sunState.get])
    }

    private groundColorState = new Reactive("#ffffff")
    public get groundColor() {
        return this.groundColorState.get()
    }
    public set groundColor(val) {
        this.groundColorState.set(val)
    }

    private sunState = new Reactive(true)
    public get sun() {
        return this.sunState.get()
    }
    public set sun(val) {
        this.sunState.set(val)
    }

    private sunIntensityState = new Reactive(0.5)
    public get sunIntensity() {
        return this.sunIntensityState.get()
    }
    public set sunIntensity(val) {
        this.sunIntensityState.set(val)
    }

    private sunColorState = new Reactive("#ffffff")
    public get sunColor() {
        return this.sunColorState.get()
    }
    public set sunColor(val) {
        this.sunColorState.set(val)
    }
}
