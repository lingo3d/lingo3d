import { AmbientLight } from "three"
import LightBase from "../core/LightBase"
import ILight from "../../interface/ILight"

export default class extends LightBase<AmbientLight> implements ILight {
    public constructor() {
        super(new AmbientLight())
    }
}