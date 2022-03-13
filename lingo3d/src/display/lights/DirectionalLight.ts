import { DirectionalLightHelper, DirectionalLight } from "three"
import ILight from "../../interface/ILight"
import LightBase from "../core/LightBase"

export default class extends LightBase<DirectionalLight> implements ILight {
    public constructor() {
        super(new DirectionalLight(), DirectionalLightHelper)
    }
}