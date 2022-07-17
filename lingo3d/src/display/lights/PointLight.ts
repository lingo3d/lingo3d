import { PointLight as ThreePointLight, PointLightHelper } from "three"
import IPointLight, { pointLightDefaults, pointLightSchema } from "../../interface/IPointLight"
import LightBase from "../core/LightBase"

export class PointLight extends LightBase<typeof ThreePointLight> implements IPointLight {
    public static componentName = "pointLight"
    public static defaults = pointLightDefaults
    public static schema = pointLightSchema

    public constructor() {
        super(ThreePointLight, PointLightHelper)
    }

    public get decay() {
        return this.light.decay
    }
    public set decay(val) {
        this.light.decay = val
    }

    public get distance() {
        return this.light.distance
    }
    public set distance(val) {
        this.light.distance = val
    }
}