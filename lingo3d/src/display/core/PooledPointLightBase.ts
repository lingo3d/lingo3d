import GimbalObjectManager from "./GimbalObjectManager"
import IPooledPointLight from "../../interface/IPooledPointLight"
import { ColorString } from "../../interface/ITexturedStandard"
import { Sphere } from "three"
import PointLight from "../lights/PointLight"
import HelperSprite from "../core/utils/HelperSprite"
import SpotLight from "../lights/SpotLight"
import Cube from "../primitives/Cube"
import { POINTLIGHT_DISTANCE } from "../../globals"

export default abstract class PooledPointLightBase<
        T extends PointLight | SpotLight = PointLight
    >
    extends GimbalObjectManager
    implements IPooledPointLight
{
    public $light?: T
    public $boundingSphere = new Sphere()

    private helperSprite: HelperSprite

    public constructor() {
        super()
        this.helperSprite = new HelperSprite("light", this)
    }

    protected override disposeNode() {
        super.disposeNode()
        this.helperSprite.dispose()
    }

    private _distance = POINTLIGHT_DISTANCE
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
}
