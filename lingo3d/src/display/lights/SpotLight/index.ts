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
import { ssrExcludeSet } from "../../../engine/renderLoop/effectComposer/ssrEffect/renderSetup"
import {
    addVolumetricSpotLightSystem,
    deleteVolumetricSpotLightSystem
} from "../../../systems/volumetricSpotLightSystem"

const coneGeometry = new ConeGeometry(0.5, 1, 256)

export default class SpotLight
    extends LightBase<ThreeSpotLight>
    implements ISpotLight
{
    public static componentName = "spotLight"
    public static defaults = spotLightDefaults
    public static schema = spotLightSchema

    protected override shadowBiasCoeff = 1.5

    public constructor() {
        super(new ThreeSpotLight(), SpotLightHelper)
        this.distance = 1000
        this.angle = 45
        this.penumbra = 0.2

        const light = this.object3d
        this.outerObject3d.add(light.target)
        light.position.y = 0
        light.target.position.y = -0.1

        this.createEffect(() => {
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

            addVolumetricSpotLightSystem(cone, { light: this, material })
            return () => {
                material.dispose()
                this.outerObject3d.remove(cone)
                ssrExcludeSet.delete(cone)
                deleteVolumetricSpotLightSystem(cone)
            }
        }, [this.volumetricState.get])
    }

    public get angle() {
        return this.object3d.angle * rad2Deg
    }
    public set angle(val) {
        this.object3d.angle = val * deg2Rad
    }

    public get penumbra() {
        return this.object3d.penumbra
    }
    public set penumbra(val) {
        this.object3d.penumbra = val
    }

    public get decay() {
        return this.object3d.decay
    }
    public set decay(val) {
        this.object3d.decay = val
    }

    public get distance() {
        return this.object3d.distance * M2CM
    }
    public set distance(val) {
        this.object3d.distance = val * CM2M
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
