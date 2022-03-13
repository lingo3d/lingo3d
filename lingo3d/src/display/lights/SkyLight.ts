import { Color, HemisphereLight, HemisphereLightHelper } from "three"
import LightBase from "../core/LightBase"
import ISkyLight from "../../interface/ISkyLight"

export default class extends LightBase<HemisphereLight> implements ISkyLight {
    public constructor() {
        super(new HemisphereLight(), HemisphereLightHelper)
    }

    public get groundColor() {
        return "#" + this.object3d.groundColor.getHexString()
    }
    public set groundColor(val: string) {
        this.object3d.groundColor = new Color(val)
    }
}