import { Color, HemisphereLight, HemisphereLightHelper } from "three"
import LightBase from "../core/LightBase"
import ISkyLight, { skyLightDefaults } from "../../interface/ISkyLight"

export default class extends LightBase<HemisphereLight> implements ISkyLight {
    public static componentName = "skyLight"
    public static defaults = skyLightDefaults

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