import { RectAreaLight } from "three"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"
import LightBase from "../core/LightBase"
import IAreaLight from "../../interface/IAreaLight"
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js"

export default class extends LightBase<RectAreaLight> implements IAreaLight {
    public constructor() {
        super(new RectAreaLight(), RectAreaLightHelper)
        RectAreaLightUniformsLib.init()
    }

    public get power() {
        return this.object3d.power
    }
    public set power(val: number) {
        this.object3d.power = val
    }
}