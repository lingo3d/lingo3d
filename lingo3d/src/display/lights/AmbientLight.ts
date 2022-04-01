import { AmbientLight } from "three"
import LightBase from "../core/LightBase"
import IAmbientLight, { ambientLightDefaults } from "../../interface/IAmbientLight"

export default class extends LightBase<AmbientLight> implements IAmbientLight {
    public static componentName = "ambientLight"
    public static defaults = ambientLightDefaults

    public constructor() {
        super(new AmbientLight())
    }
}