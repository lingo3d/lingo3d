import { PointLight as ThreePointLight } from "three"
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
    addShadowPointLightSystem,
    deleteShadowPointLightSystem
} from "../../systems/shadowPointLightSystem"

export default class PointLight
    extends LightBase<ThreePointLight>
    implements IPointLight
{
    public static componentName = "pointLight"
    public static defaults = pointLightDefaults
    public static schema = pointLightSchema

    public constructor() {
        super(new ThreePointLight())
        this.distance = 1000
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
                light.shadow &&
                (() => {
                    addShadowPointLightSystem(this, { step: undefined })
                    return new Cancellable(() =>
                        deleteShadowPointLightSystem(this)
                    )
                })
        )

        this.cancelHandle(
            "castShadow",
            val === "physics"
                ? () => {
                      light.shadow.autoUpdate = false
                      "distance" in this &&
                          addShadowPhysicsSystem(this, { count: 0 })
                      return new Cancellable(() => {
                          light.shadow.autoUpdate = true
                          "distance" in this && deleteShadowPhysicsSystem(this)
                      })
                  }
                : undefined
        )
    }
}
