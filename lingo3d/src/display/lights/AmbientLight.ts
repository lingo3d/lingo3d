import { AmbientLight } from "three"
import LightBase from "../core/LightBase"
import ILight from "../../interface/ILight"

export default class extends LightBase<AmbientLight> implements ILight {
    public static componentName = "ambientLight"

    public constructor() {
        super(new AmbientLight())
    }
}