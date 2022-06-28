import { DirectionalLightHelper, DirectionalLight as ThreeDirectionalLight } from "three"
import IDirectionalLight, { directionalLightDefaults, directionalLightSchema } from "../../interface/IDirectionalLight"
import LightBase from "../core/LightBase"

export default class DirectionalLight extends LightBase<ThreeDirectionalLight> implements IDirectionalLight {
    public static componentName = "directionalLight"
    public static defaults = directionalLightDefaults
    public static schema = directionalLightSchema

    public constructor() {
        super(new ThreeDirectionalLight(), DirectionalLightHelper)
        this.innerY = 0
    }
}