import { Color, HemisphereLight } from "three"
import LightBase from "../core/LightBase"
import ISkyLight, {
    ShadowDistance,
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

        this.createEffect(() => {
            const shadowDistance = this.shadowDistanceState.get()
            const csmOptions = (() => {
                if (shadowDistance === "middle")
                    return {
                        maxFar: 30,
                        shadowMapSize: 1024,
                        shadowBias: -0.000055
                    }
                if (shadowDistance === "near")
                    return {
                        maxFar: 10,
                        shadowMapSize: 1024,
                        shadowBias: -0.000025
                    }
                return {
                    maxFar: 100,
                    shadowMapSize: 2048,
                    shadowBias: -0.0001
                }
            })()

            const csm = new CSM({
                ...csmOptions,
                cascades: 1,
                parent: scene,
                camera: getCameraRendered(),
                lightIntensity: 0.5
            })

            const handle0 = onBeforeRender(() => {
                const lightDirection = this.outerObject3d.position
                    .clone()
                    .normalize()
                    .multiplyScalar(-1)

                csm.lightDirection = lightDirection
                csm.update()
            })
            const handle1 = getCameraRendered((val) => {
                csm.camera = val
            })
            return () => {
                handle0.cancel()
                handle1.cancel()
                csm.dispose()
                for (const light of csm.lights) {
                    light.dispose()
                    scene.remove(light)
                }
            }
        }, [this.shadowDistanceState.get])
    }

    private shadowDistanceState = new Reactive<ShadowDistance>("middle")
    public get shadowDistance() {
        return this.shadowDistanceState.get()
    }
    public set shadowDistance(val) {
        this.shadowDistanceState.set(val)
    }

    public get groundColor() {
        const light = this.lightState.get()
        if (!light) return "#ffffff"

        return "#" + light.groundColor.getHexString()
    }
    public set groundColor(val) {
        this.cancelHandle("groundColor", () =>
            this.lightState.get(
                (light) => light && (light.groundColor = new Color(val))
            )
        )
    }
}
