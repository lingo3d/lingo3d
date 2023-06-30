import {
    ConeGeometry,
    Mesh,
    SpotLight as ThreeSpotLight,
    SpotLightHelper
} from "three"
import ISpotLight, {
    spotLightDefaults,
    spotLightSchema
} from "../../../interface/ISpotLight"
import { deg2Rad, rad2Deg } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { ssrExcludeSet } from "../../../collections/ssrExcludeSet"
import PointLightBase from "../../core/PointLightBase"
import { renderCheckExcludeSet } from "../../../collections/renderCheckExcludeSet"
import unsafeSetValue from "../../../utils/unsafeSetValue"
import { spotLightShadowResolutionSystem } from "../../../systems/spotLightShadowResolutionSystem"
import { volumetricSpotLightSystem } from "../../../systems/volumetricSpotLightSystem"

const coneGeometry = new ConeGeometry(0.5, 1, 256)

export default class SpotLight
    extends PointLightBase<ThreeSpotLight>
    implements ISpotLight
{
    public static componentName = "spotLight"
    public static defaults = spotLightDefaults
    public static schema = spotLightSchema

    public constructor() {
        super(new ThreeSpotLight(), SpotLightHelper)
        this.angle = 45
        this.penumbra = 0.2

        const light = this.object3d
        this.outerObject3d.add(light.target)
        light.position.y = 0
        light.target.position.y = -0.1
    }

    public override get shadows() {
        return super.shadows
    }
    public override set shadows(val) {
        super.shadows = val
        val
            ? spotLightShadowResolutionSystem.add(this)
            : spotLightShadowResolutionSystem.delete(this)
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

    private _volumetric = false
    public get volumetric() {
        return this._volumetric
    }
    public set volumetric(val) {
        this._volumetric = val

        // this.cancelHandle(
        //     "volumetric",
        //     val &&
        //         (() => {
        //             const material = new SpotLightMaterial()
        //             unsafeSetValue(material, "lightColor", this.object3d.color)
        //             unsafeSetValue(material, "anglePower", 2)

        //             const cone = new Mesh(coneGeometry, material)
        //             this.outerObject3d.add(cone)
        //             ssrExcludeSet.add(cone)
        //             renderCheckExcludeSet.add(cone)
        //             volumetricSpotLightSystem.add(cone, {
        //                 light: this,
        //                 material
        //             })
        //             return new Cancellable(() => {
        //                 material.dispose()
        //                 this.outerObject3d.remove(cone)
        //                 ssrExcludeSet.delete(cone)
        //                 renderCheckExcludeSet.delete(cone)
        //                 volumetricSpotLightSystem.delete(cone)
        //             })
        //         })
        // )
    }

    public volumetricDistance = 1
}
