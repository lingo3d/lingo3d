import ISkyLight, {
    skyLightDefaults,
    skyLightSchema
} from "../../interface/ISkyLight"
import { Reactive } from "@lincode/reactivity"
import { CSM } from "three/examples/jsm/csm/CSM"
import scene from "../../engine/scene"
import { getCameraRendered } from "../../states/useCameraRendered"
import DirectionalLight from "./DirectionalLight"
import { eraseAppendable } from "../../api/core/collections"
import renderSystemWithData from "../../utils/renderSystemWithData"
import SimpleObjectManager from "../core/SimpleObjectManager"
import AmbientLight from "./AmbientLight"

const updateLightDirection = (self: SkyLight, csm: CSM) =>
    csm.lightDirection.copy(
        self.position.clone().normalize().multiplyScalar(-1)
    )
const [addLightSystem, deleteLightSystem] = renderSystemWithData(
    (csm: CSM, { self }: { self: SkyLight }) => {
        updateLightDirection(self, csm)
        csm.update()
    }
)
const updateBackLight = (self: SkyLight, backLight: DirectionalLight) =>
    backLight.position.copy(self.position.clone().multiplyScalar(-1))

const [addBackLightSystem, deleteBackLightSystem] = renderSystemWithData(
    (self: SkyLight, data: { backLight: DirectionalLight }) =>
        updateBackLight(self, data.backLight)
)

export default class SkyLight extends SimpleObjectManager implements ISkyLight {
    public static componentName = "skyLight"
    public static defaults = skyLightDefaults
    public static schema = skyLightSchema

    public constructor() {
        super()

        const backLight = new DirectionalLight()
        backLight.helper = false
        eraseAppendable(backLight)
        addBackLightSystem(this, { backLight })

        const ambientLight = new AmbientLight()
        ambientLight.helper = false
        eraseAppendable(ambientLight)

        this.then(() => {
            deleteBackLightSystem(this)
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
                lightIntensity:
                    intensity * (this.cascadeShadowState.get() ? 0.5 : 1)
            })
            updateLightDirection(this, csm)

            addLightSystem(csm, { self: this })
            const handle = getCameraRendered((val) => (csm.camera = val))
            return () => {
                deleteLightSystem(csm)
                handle.cancel()
                csm.dispose()
                for (const light of csm.lights) {
                    light.dispose()
                    scene.remove(light)
                }
            }
        }, [
            this.intensityState.get,
            this.cascadeShadowState.get,
            this.castShadowState.get
        ])

        this.createEffect(() => {
            if (!this.cascadeShadowState.get() || !this.castShadowState.get())
                return

            const csm = new CSM({
                maxFar: 100,
                shadowMapSize: 512,
                shadowBias: -0.0005,
                cascades: 1,
                parent: scene,
                camera: getCameraRendered(),
                lightIntensity: this.intensityState.get() * 0.5
            })
            updateLightDirection(this, csm)

            addLightSystem(csm, { self: this })
            const handle = getCameraRendered((val) => (csm.camera = val))
            return () => {
                deleteLightSystem(csm)
                handle.cancel()
                csm.dispose()
                for (const light of csm.lights) {
                    light.dispose()
                    scene.remove(light)
                }
            }
        }, [
            this.intensityState.get,
            this.cascadeShadowState.get,
            this.castShadowState.get
        ])
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

    private cascadeShadowState = new Reactive(false)
    public get cascadeShadow() {
        return this.cascadeShadowState.get()
    }
    public set cascadeShadow(val) {
        this.cascadeShadowState.set(val)
    }
}
