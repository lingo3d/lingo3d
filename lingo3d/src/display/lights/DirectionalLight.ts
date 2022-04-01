import { DirectionalLightHelper, DirectionalLight } from "three"
import IDirectionalLight, { directionalLightDefaults } from "../../interface/IDirectionalLight"
import LightBase from "../core/LightBase"

export default class extends LightBase<DirectionalLight> implements IDirectionalLight {
    public static componentName = "directionalLight"
    public static defaults = directionalLightDefaults

    public constructor() {
        super(new DirectionalLight(), DirectionalLightHelper)
    }
}