import { RectAreaLight } from "three"
import IAreaLight, {
    areaLightDefaults,
    areaLightSchema
} from "../../interface/IAreaLight"
import { lazy } from "@lincode/utils"
import Plane from "../primitives/Plane"
import { configAreaLightSystem } from "../../systems/configSystems/configAreaLightSystem"
import { areaLightTransformEditSystem } from "../../systems/eventSystems/areaLightTransformEditSystem"

const lazyInit = lazy(async () => {
    const { RectAreaLightUniformsLib } = await import(
        "three/examples/jsm/lights/RectAreaLightUniformsLib"
    )
    RectAreaLightUniformsLib.init()
})

export default class AreaLight extends Plane implements IAreaLight {
    public static override componentName = "areaLight"
    public static override defaults = areaLightDefaults
    public static override schema = areaLightSchema

    public $light?: RectAreaLight

    public constructor() {
        super()
        this.emissive = true

        lazyInit().then(() => {
            if (this.done) return
            const light = (this.$light = new RectAreaLight())
            this.outerObject3d.add(light)
            this.then(() => light.dispose())
            configAreaLightSystem.add(this)
        })
        areaLightTransformEditSystem.add(this)
    }

    public override get color() {
        return super.color
    }
    public override set color(val) {
        super.color = val
        configAreaLightSystem.add(this)
    }

    private _intensity = 1
    public get intensity() {
        return this._intensity
    }
    public set intensity(val) {
        this._intensity = val
        configAreaLightSystem.add(this)
    }

    public override get width() {
        return super.width
    }
    public override set width(val) {
        super.width = val
        configAreaLightSystem.add(this)
    }

    public override get height() {
        return super.height
    }
    public override set height(val) {
        super.height = val
        configAreaLightSystem.add(this)
    }

    public override get scaleX() {
        return super.scaleX
    }
    public override set scaleX(val) {
        super.scaleX = val
        configAreaLightSystem.add(this)
    }

    public override get scaleY() {
        return super.scaleY
    }
    public override set scaleY(val) {
        super.scaleY = val
        configAreaLightSystem.add(this)
    }

    public override get depth() {
        return 0
    }
    public override set depth(_) {}
    public override get scaleZ() {
        return 0
    }
    public override set scaleZ(_) {}
}
