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
import { CM2M, M2CM } from "../../../globals"
import { deg2Rad, rad2Deg } from "@lincode/math"
import { SpotLightMaterial } from "./SpotLightMaterial"
import {
    addVolumetricSpotLightSystem,
    deleteVolumetricSpotLightSystem
} from "../../../systems/volumetricSpotLightSystem"
import { Cancellable } from "@lincode/promiselikes"
import { ssrExcludeSet } from "../../../collections/ssrExcludeSet"
import {
    addLightIntensitySystem,
    deleteLightIntensitySystem
} from "../../../systems/lightIntensitySystem"

const coneGeometry = new ConeGeometry(0.5, 1, 256)

export default class SpotLight
    extends LightBase<ThreeSpotLight>
    implements ISpotLight
{
    public static componentName = "spotLight"
    public static defaults = spotLightDefaults
    public static schema = spotLightSchema

    public constructor() {
        super(new ThreeSpotLight(), SpotLightHelper)
        this.distance = 1000
        this.angle = 45
        this.penumbra = 0.2

        const light = this.object3d
        this.outerObject3d.add(light.target)
        light.position.y = 0
        light.target.position.y = -0.1

        addLightIntensitySystem(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        deleteLightIntensitySystem(this)
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

    public get distance() {
        return this.object3d.distance * M2CM
    }
    public set distance(val) {
        this.object3d.distance = val * CM2M
    }

    private _volumetric = false
    public get volumetric() {
        return this._volumetric
    }
    public set volumetric(val) {
        this._volumetric = val

        this.cancelHandle(
            "volumetric",
            val &&
                (() => {
                    const material = new SpotLightMaterial()
                    //@ts-ignore
                    material.lightColor = this.object3d.color
                    //@ts-ignore
                    material.anglePower = 2

                    const cone = new Mesh(coneGeometry, material)
                    this.outerObject3d.add(cone)
                    ssrExcludeSet.add(cone)
                    addVolumetricSpotLightSystem(cone, {
                        light: this,
                        material
                    })
                    return new Cancellable(() => {
                        material.dispose()
                        this.outerObject3d.remove(cone)
                        ssrExcludeSet.delete(cone)
                        deleteVolumetricSpotLightSystem(cone)
                    })
                })
        )
    }

    public volumetricDistance = 1
}
