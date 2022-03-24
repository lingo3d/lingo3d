import { RectAreaLight } from "three"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"
import LightBase from "../core/LightBase"
import IAreaLight from "../../interface/IAreaLight"
import { lazy } from "@lincode/utils"
import { setAreaLight } from "../../states/useAreaLight"
import { setAreaLightInitialized } from "../../states/useAreaLightInitialized"

const lazyInit = lazy(async () => {
    const { RectAreaLightUniformsLib } = await import("three/examples/jsm/lights/RectAreaLightUniformsLib.js")
    RectAreaLightUniformsLib.init()
    setAreaLightInitialized(true)
})

export default class extends LightBase<RectAreaLight> implements IAreaLight {
    public static componentName = "areaLight"

    public constructor() {
        super(new RectAreaLight(), RectAreaLightHelper)
        setAreaLight(true)
        lazyInit()
    }

    public get power() {
        return this.object3d.power
    }
    public set power(val: number) {
        this.object3d.power = val
    }
}