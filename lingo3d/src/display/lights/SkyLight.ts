import { Color, HemisphereLight } from "three"
import LightBase, { mapShadowResolution } from "../core/LightBase"
import ISkyLight, {
    skyLightDefaults,
    skyLightSchema
} from "../../interface/ISkyLight"
import { Reactive } from "@lincode/reactivity"
import { CSM } from "three/examples/jsm/csm/CSM"
import scene from "../../engine/scene"
import { getCameraRendered } from "../../states/useCameraRendered"
import { onBeforeRender } from "../../events/onBeforeRender"
import {
    getShadowDistance,
    ShadowDistance
} from "../../states/useShadowDistance"
import { assertExhaustive } from "@lincode/utils"
import {
    getShadowResolution,
    ShadowResolution
} from "../../states/useShadowResolution"
import DirectionalLight from "./DirectionalLight"
import { hiddenAppendables } from "../../api/core/collections"

const mapCSMOptions = (
    val: ShadowDistance,
    shadowResolution: ShadowResolution
) => {
    switch (val) {
        case "near":
            return {
                maxFar: 10,
                shadowMapSize: mapShadowResolution(shadowResolution) * 2,
                shadowBias: -0.000025
            }
        case "middle":
            return {
                maxFar: 30,
                shadowMapSize: mapShadowResolution(shadowResolution) * 2,
                shadowBias: -0.000055
            }
        case "far":
            return {
                maxFar: 100,
                shadowMapSize: mapShadowResolution(shadowResolution) * 4,
                shadowBias: -0.0001
            }
        default:
            assertExhaustive(val)
    }
}

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
            if (!this.castShadowState.get()) {
                const directionalLight = new DirectionalLight()
                directionalLight.intensity = 0.5
                this.append(directionalLight)
                hiddenAppendables.add(directionalLight)
                const handle = this.helperState.get(
                    (val) => (directionalLight.helper = val)
                )
                return () => {
                    directionalLight.dispose()
                    handle.cancel()
                }
            }

            const csm = new CSM({
                ...mapCSMOptions(
                    this.shadowDistanceState.get() ?? getShadowDistance(),
                    this.shadowResolutionState.get() ?? getShadowResolution()
                ),
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
        }, [
            this.castShadowState.get,
            this.shadowDistanceState.get,
            getShadowDistance,
            getShadowResolution
        ])
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
