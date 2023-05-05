import ObjectManager from "../core/ObjectManager"
import {
    disposePointLights,
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
import HelperSprite from "../core/utils/HelperSprite"
import { onPointLightPool } from "../../events/onPointLightPool"
import { pointLightPoolPtr } from "../../pointers/pointLightPoolPtr"

const lightSet = new Set<PooledPointLight>()

let requested = false
const requestPointLights = () => {
    if (requested) return
    requested = true
    const lights: Array<PointLight> = []
    for (let i = 0; i < pointLightPoolPtr[0]; ++i)
        lights.push(requestPointLight([], ""))
    for (const light of lights) releasePointLight(light)
}
onPointLightPool(() => {
    if (!requested) return
    requested = false
    disposePointLights()
    requestPointLights()
    for (const light of lightSet)
        addPooledPointLightSystem(light, { visible: false })
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
        requestPointLights()
        addPooledPointLightSystem(this, { visible: false })
        lightSet.add(this)

        const sprite = new HelperSprite("light", this)
        this.then(() => {
            sprite.dispose()
            lightSet.delete(this)
        })
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

    private _fade = true
    public get fade() {
        return this._fade
    }
    public set fade(value) {
        this._fade = value
        if (this.$light) this.$light.fade = value
    }
}
