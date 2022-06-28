import { Color, HemisphereLight, HemisphereLightHelper } from "three"
import LightBase from "../core/LightBase"
import ISkyLight, { skyLightDefaults, skyLightSchema } from "../../interface/ISkyLight"

export default class Skylight extends LightBase<HemisphereLight> implements ISkyLight {
    public static componentName = "skyLight"
    public static defaults = skyLightDefaults
    public static schema = skyLightSchema

    public constructor() {
        super(new HemisphereLight(), HemisphereLightHelper)
        this.innerY = 0
    }

    public get groundColor() {
        return "#" + this.object3d.groundColor.getHexString()
    }
    public set groundColor(val: string) {
        this.object3d.groundColor = new Color(val)
    }
}