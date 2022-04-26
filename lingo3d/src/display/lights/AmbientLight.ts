import { AmbientLight } from "three"
import LightBase from "../core/LightBase"
import IAmbientLight, { ambientLightDefaults, ambientLightSchema } from "../../interface/IAmbientLight"

export default class extends LightBase<AmbientLight> implements IAmbientLight {
    public static componentName = "ambientLight"
    public static defaults = ambientLightDefaults
    public static schema = ambientLightSchema

    public constructor() {
        super(new AmbientLight())
    }
}