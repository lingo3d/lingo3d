import { Color, HemisphereLight } from "three"
import LightBase from "../core/LightBase"
import ISkyLight, {
    skyLightDefaults,
    skyLightSchema
} from "../../interface/ISkyLight"
import { Reactive } from "@lincode/reactivity"
import { CSM } from "three/examples/jsm/csm/CSM"
import scene from "../../engine/scene"
import { getCameraRendered } from "../../states/useCameraRendered"
import { onBeforeRender } from "../../events/onBeforeRender"

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
            const csm = new CSM({
                maxFar: 100,
                cascades: 1,
                mode: "practical" as any,
                parent: scene,
                shadowMapSize: 1024,
                lightDirection: this.outerObject3d.position
                    .clone()
                    .normalize()
                    .multiplyScalar(-1),
                lightIntensity: 0.5,
                camera: getCameraRendered()
            })
            const handle = onBeforeRender(() => {
                csm.update()
            })
            getCameraRendered((camera) => (csm.camera = camera))

            return () => {
                csm.dispose()
                handle.cancel()
            }
        }, [])
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
