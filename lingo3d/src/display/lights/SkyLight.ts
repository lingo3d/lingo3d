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
            const cam = getCameraRendered()
            const intensity = this.intensityState.get()

            const csm = new CSM({
                maxFar: 100,
                shadowMapSize: 512,
                shadowBias: -0.001,
                cascades: 1,
                parent: scene,
                camera: cam,
                lightIntensity: intensity * 0.5
            })
            const csm2 = new CSM({
                maxFar: 50,
                shadowMapSize: 2048,
                shadowBias: -0.0001,
                cascades: 1,
                parent: scene,
                camera: cam,
                lightIntensity: intensity * 0.5
            })
            updateLightDirection(this, csm)
            updateLightDirection(this, csm2)
            updateBackLight(this, backLight)

            addLightSystem(csm, { self: this })
            addLightSystem(csm2, { self: this })
            const handle = getCameraRendered((val) => {
                csm.camera = val
                csm2.camera = val
            })
            return () => {
                deleteLightSystem(csm)
                deleteLightSystem(csm2)
                handle.cancel()
                csm.dispose()
                csm2.dispose()
                for (const light of [...csm.lights, ...csm2.lights]) {
                    light.dispose()
                    scene.remove(light)
                }
            }
        }, [this.intensityState.get])
    }

    private intensityState = new Reactive(1)
    public get intensity() {
        return this.intensityState.get()
    }
    public set intensity(val) {
        this.intensityState.set(val)
    }
}
