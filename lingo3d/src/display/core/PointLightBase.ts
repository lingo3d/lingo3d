import {
    Sphere,
    SpotLightHelper,
    PointLight as ThreePointLight,
    SpotLight as ThreeSpotLight
} from "three"
import {
    CM2M,
    M2CM,
    POINTLIGHT_DISTANCE,
    POINTLIGHT_INTENSITY
} from "../../globals"
import IPointLightBase from "../../interface/IPointLightBase"
import LightBase from "./LightBase"
import { shadowRenderTargetPool } from "../../pools/objectPools/shadowRenderTargetPool"
import Cube from "../primitives/Cube"
import unsafeSetValue from "../../utils/unsafeSetValue"
import { lightIntensitySystem } from "../../systems/lightIntensitySystem"
import { updateShadowSystem } from "../../systems/updateShadowSystem"

export default abstract class PointLightBase<
        T extends ThreePointLight | ThreeSpotLight = ThreePointLight
    >
    extends LightBase<T>
    implements IPointLightBase
{
    public constructor(light: T, helper?: typeof SpotLightHelper) {
        super(light, helper)
        light.shadow.autoUpdate = false
        this.distance = POINTLIGHT_DISTANCE
        this.intensity = POINTLIGHT_INTENSITY
        this.shadows = true
    }

    protected override disposeNode() {
        shadowRenderTargetPool.release(this.$innerObject.shadow.map)
        unsafeSetValue(this.$innerObject.shadow, "map", null)
        super.disposeNode()
    }

    private renderCheckBox?: Cube
    public get isRendered() {
        if (!this.renderCheckBox) {
            const renderCheckBox = (this.renderCheckBox = new Cube())
            renderCheckBox.$ghost()
            renderCheckBox.opacity = 0.001
            this.append(renderCheckBox)
        }
        return this.renderCheckBox.isRendered
    }

    public $boundingSphere = new Sphere()
    public get distance() {
        return this.$innerObject.distance * M2CM
    }
    public set distance(val) {
        this.$innerObject.distance = val * CM2M
    }

    public get shadows() {
        return this.$innerObject.castShadow
    }
    public set shadows(val) {
        this.$innerObject.castShadow = val
        val ? updateShadowSystem.add(this) : updateShadowSystem.delete(this)
    }

    private _intensity = POINTLIGHT_INTENSITY
    public override get intensity() {
        return this._intensity
    }
    public override set intensity(val) {
        this._intensity = val
        if (!this._fade) this.$innerObject.intensity = val
    }

    private _fade = false
    public get fade() {
        return this._fade
    }
    public set fade(val) {
        this._fade = val
        if (val) {
            lightIntensitySystem.add(this)
            return
        }
        lightIntensitySystem.delete(this)
        this.intensity = this._intensity
    }
}
