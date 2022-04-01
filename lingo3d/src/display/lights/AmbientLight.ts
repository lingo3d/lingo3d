import { AmbientLight } from "three"
import LightBase from "../core/LightBase"
import IAmbientLight from "../../interface/IAmbientLight"

export default class extends LightBase<AmbientLight> implements IAmbientLight {
    public static componentName = "ambientLight"

    public constructor() {
        super(new AmbientLight())
    }
}