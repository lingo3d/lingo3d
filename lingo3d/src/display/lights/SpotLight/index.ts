import {
    ConeGeometry,
    Mesh,
    SpotLight as ThreeSpotLight,
    SpotLightHelper
} from "three"
import LightBase from "../../core/LightBase"
import ISpotLight, {
    spotLightDefaults,
    spotLightSchema
} from "../../../interface/ISpotLight"
import { CM2M, M2CM, SHADOW_BIAS } from "../../../globals"
import { deg2Rad, rad2Deg } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import { SpotLightMaterial } from "./SpotLightMaterial"
import getWorldPosition from "../../utils/getWorldPosition"
import { ssrExcludeSet } from "../../../engine/renderLoop/effectComposer/ssrEffect/renderSetup"
import renderSystemWithData from "../../../utils/renderSystemWithData"

const coneGeometry = new ConeGeometry(0.5, 1, 256)

const [addVolumetricSystem, deleteVolumetricSystem] = renderSystemWithData(
    (cone: Mesh, { light, material }: { light: SpotLight; material: any }) => {
        cone.scale.y = light.distance * CM2M * light.volumetricDistance
        cone.position.y = -cone.scale.y * 0.5
        cone.scale.x = cone.scale.z =
            2 * Math.tan(light.angle * deg2Rad) * cone.scale.y
        material.attenuation = cone.scale.y
        material.spotPosition.copy(getWorldPosition(light.outerObject3d))
    }
)

export default class SpotLight
    extends LightBase<typeof ThreeSpotLight>
    implements ISpotLight
{
    public static componentName = "spotLight"
    public static defaults = spotLightDefaults
    public static schema = spotLightSchema

    public constructor() {
        super(ThreeSpotLight, SpotLightHelper)
        this.distance = 1000
        this.angle = 45
        this.penumbra = 0.2

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!light) return

            this.outerObject3d.add(light.target)
            light.position.y = 0
            light.target.position.y = -0.1
            light.shadow.bias = SHADOW_BIAS * 1.5

            return () => {
                this.outerObject3d.remove(light.target)
            }
        }, [this.lightState.get])

        this.createEffect(() => {
            const light = this.lightState.get()
            const volumetric = this.volumetricState.get()
            if (!light || !volumetric) return

            const material = new SpotLightMaterial()
            //@ts-ignore
            material.lightColor = light.color
            //@ts-ignore
            material.anglePower = 2

            const cone = new Mesh(coneGeometry, material)
            this.outerObject3d.add(cone)
            ssrExcludeSet.add(cone)

            addVolumetricSystem(cone, { light: this, material })
            return () => {
                material.dispose()
                this.outerObject3d.remove(cone)
                ssrExcludeSet.delete(cone)
                deleteVolumetricSystem(cone)
            }
        }, [this.lightState.get, this.volumetricState.get])
    }

    public get angle() {
        const light = this.lightState.get()
        if (!light) return 45

        return light.angle * rad2Deg
    }
    public set angle(val) {
        this.cancelHandle("angle", () =>
            this.lightState.get(
                (light) => light && (light.angle = val * deg2Rad)
            )
        )
    }

    public get penumbra() {
        const light = this.lightState.get()
        if (!light) return 0.2

        return light.penumbra
    }
    public set penumbra(val) {
        this.cancelHandle("penumbra", () =>
            this.lightState.get((light) => light && (light.penumbra = val))
        )
    }

    public get decay() {
        const light = this.lightState.get()
        if (!light) return 1

        return light.decay
    }
    public set decay(val) {
        this.cancelHandle("decay", () =>
            this.lightState.get((light) => light && (light.decay = val))
        )
    }

    public get distance() {
        const light = this.lightState.get()
        if (!light) return 1000

        return light.distance * M2CM
    }
    public set distance(val) {
        this.cancelHandle("distance", () =>
            this.lightState.get(
                (light) => light && (light.distance = val * CM2M)
            )
        )
    }

    private volumetricState = new Reactive(false)
    public get volumetric() {
        return this.volumetricState.get()
    }
    public set volumetric(val) {
        this.volumetricState.set(val)
    }

    public volumetricDistance = 1
}
