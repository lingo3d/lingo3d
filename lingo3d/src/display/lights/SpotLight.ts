import { SpotLight as ThreeSpotLight, SpotLightHelper } from "three"
import LightBase from "../core/LightBase"
import ISpotLight, { spotLightDefaults, spotLightSchema } from "../../interface/ISpotLight"

export default class SpotLight extends LightBase<typeof ThreeSpotLight> implements ISpotLight {
    public static componentName = "spotLight"
    public static defaults = spotLightDefaults
    public static schema = spotLightSchema

    public constructor() {
        super(ThreeSpotLight, SpotLightHelper)
        this.innerY = 0
    }

    public get angle() {
        return this.light.angle
    }
    public set angle(val) {
        this.light.angle = val
    }

    public get penumbra() {
        return this.light.penumbra
    }
    public set penumbra(val) {
        this.light.penumbra = val
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