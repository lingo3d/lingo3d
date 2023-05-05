import ObjectManager from "../core/ObjectManager"
import {
    disposeSpotLights,
    releaseSpotLight,
    requestSpotLight
} from "../../pools/objectPools/spotLightPool"
import IPooledSpotLight, {
    pooledSpotLightDefaults,
    pooledSpotLightSchema
} from "../../interface/IPooledSpotLight"
import { ColorString } from "../../interface/ITexturedStandard"
import { Sphere } from "three"
import { addPooledSpotLightSystem } from "../../systems/pooledSpotLightSystem"
import SpotLight from "./SpotLight"
import HelperSprite from "../core/utils/HelperSprite"
import { onSpotLightPool } from "../../events/onSpotLightPool"
import { spotLightPoolPtr } from "../../pointers/spotLightPoolPtr"

const lightSet = new Set<PooledSpotLight>()

let requested = false
const requestSpotLights = () => {
    if (requested) return
    requested = true
    const lights: Array<SpotLight> = []
    for (let i = 0; i < spotLightPoolPtr[0]; ++i)
        lights.push(requestSpotLight([], ""))
    for (const light of lights) releaseSpotLight(light)
}
onSpotLightPool(() => {
    if (!requested) return
    requested = false
    disposeSpotLights()
    requestSpotLights()
    for (const light of lightSet)
        addPooledSpotLightSystem(light, { visible: false })
})

export default class PooledSpotLight
    extends ObjectManager
    implements IPooledSpotLight
{
    public static componentName = "pooledSpotLight"
    public static defaults = pooledSpotLightDefaults
    public static schema = pooledSpotLightSchema

    public $light?: SpotLight
    public $boundingSphere = new Sphere()

    public constructor() {
        super()
        requestSpotLights()
        addPooledSpotLightSystem(this, { visible: false })
        lightSet.add(this)

        const sprite = new HelperSprite("light", this)
        this.then(() => {
            sprite.dispose()
            lightSet.delete(this)
        })
    }

    private _angle = 45
    public get angle() {
        return this._angle
    }
    public set angle(value) {
        this._angle = value
        if (this.$light) this.$light.angle = value
    }

    private _penumbra = 0.2
    public get penumbra() {
        return this._penumbra
    }
    public set penumbra(value) {
        this._penumbra = value
        if (this.$light) this.$light.penumbra = value
    }

    private _volumetric = false
    public get volumetric() {
        return this._volumetric
    }
    public set volumetric(value) {
        this._volumetric = value
        if (this.$light) this.$light.volumetric = value
    }

    private _volumetricDistance = 1
    public get volumetricDistance() {
        return this._volumetricDistance
    }
    public set volumetricDistance(value) {
        this._volumetricDistance = value
        if (this.$light) this.$light.volumetricDistance = value
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
