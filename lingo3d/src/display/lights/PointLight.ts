import { Sphere, PointLight as ThreePointLight } from "three"
import { CM2M, M2CM } from "../../globals"
import IPointLight, {
    CastShadow,
    pointLightDefaults,
    pointLightSchema
} from "../../interface/IPointLight"
import LightBase from "../core/LightBase"
import { Cancellable } from "@lincode/promiselikes"
import {
    addShadowPhysicsSystem,
    deleteShadowPhysicsSystem
} from "../../systems/shadowPhysicsSystem"
import {
    addLightIntensitySystem,
    deleteLightIntensitySystem
} from "../../systems/lightIntensitySystem"
import {
    addPointLightShadowResolutionSystem,
    deletePointLightShadowResolutionSystem
} from "../../systems/pointLightShadowResolutionSystem"

export default class PointLight
    extends LightBase<ThreePointLight>
    implements IPointLight
{
    public static componentName = "pointLight"
    public static defaults = pointLightDefaults
    public static schema = pointLightSchema

    public constructor() {
        super(new ThreePointLight())
        this.distance = 500
        this.intensity = 10
        addLightIntensitySystem(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        deleteLightIntensitySystem(this)
    }

    public _boundingSphere = new Sphere()
    public get distance() {
        return this.object3d.distance * M2CM
    }
    public set distance(val) {
        this.object3d.distance = val * CM2M
    }

    private _castShadow: CastShadow = false
    public get castShadow() {
        return this._castShadow
    }
    public set castShadow(val) {
        this._castShadow = val

        const light = this.object3d
        light.castShadow = !!val

        this.cancelHandle(
            "castShadowResolution",
            val &&
                (() => {
                    addPointLightShadowResolutionSystem(this, {
                        step: undefined
                    })
                    return new Cancellable(() =>
                        deletePointLightShadowResolutionSystem(this)
                    )
                })
        )
        this.cancelHandle(
            "castShadowPhysics",
            val === "physics"
                ? () => {
                      light.shadow.autoUpdate = false
                      "distance" in this && addShadowPhysicsSystem(this)
                      return new Cancellable(() => {
                          light.shadow.autoUpdate = true
                          "distance" in this && deleteShadowPhysicsSystem(this)
                      })
                  }
                : undefined
        )
    }
}
