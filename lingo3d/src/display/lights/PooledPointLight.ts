import { lazy } from "@lincode/utils"
import ObjectManager from "../core/ObjectManager"
import {
    releasePointLight,
    requestPointLight
} from "../../pools/objectPools/pointLightPool"
import IPooledPointLight, {
    pooledPointLightDefaults,
    pooledPointLightSchema
} from "../../interface/IPooledPointLight"
import { ColorString } from "../../interface/ITexturedStandard"
import { Sphere } from "three"
import { addPooledPointLightSystem } from "../../systems/pooledPointLightSystem"
import PointLight from "./PointLight"

const initPointLight = lazy(() => {
    const lights: Array<PointLight> = []
    for (let i = 0; i < 4; ++i) lights.push(requestPointLight([], ""))
    for (const light of lights) releasePointLight(light)
})

export default class PooledPointLight
    extends ObjectManager
    implements IPooledPointLight
{
    public static componentName = "pooledPointLight"
    public static defaults = pooledPointLightDefaults
    public static schema = pooledPointLightSchema

    public $light?: PointLight
    public $boundingSphere = new Sphere()

    public constructor() {
        super()
        initPointLight()
        addPooledPointLightSystem(this, { visible: false })
    }

    private _distance = 500
    public get distance() {
        return this._distance
    }
    public set distance(value) {
        this._distance = value
        if (this.$light) this.$light.distance = value
    }

    private _intensity = 10
    public get intensity() {
        return this._intensity
    }
    public set intensity(value) {
        this._intensity = value
        if (this.$light) this.$light.intensity = value
    }

    private _shadows = true
    public get shadows() {
        return this._shadows
    }
    public set shadows(value) {
        this._shadows = value
        if (this.$light) this.$light.shadows = value
    }

    private _color: ColorString = "#ffffff"
    public get color() {
        return this._color
    }
    public set color(value) {
        this._color = value
        if (this.$light) this.$light.color = value
    }
}
