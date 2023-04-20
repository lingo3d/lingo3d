import { RectAreaLight } from "three"
import IAreaLight, {
    areaLightDefaults,
    areaLightSchema
} from "../../interface/IAreaLight"
import { lazy } from "@lincode/utils"
import Plane from "../primitives/Plane"
import { addConfigAreaLightSystem } from "../../systems/configSystems/configAreaLightSystem"
import { TransformControlsPayload } from "../../events/onTransformControls"
import {
    addAreaLightIntensitySystem,
    deleteAreaLightIntensitySystem
} from "../../systems/areaLightIntensitySystem"

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

    public light?: RectAreaLight

    public constructor() {
        super()
        this.object3d.castShadow = this.object3d.receiveShadow = false
        this.emissive = true

        lazyInit().then(() => {
            if (this.done) return
            const light = (this.light = new RectAreaLight())
            this.outerObject3d.add(light)
            this.then(() => light.dispose())
            addConfigAreaLightSystem(this)
        })
        this.events.on(
            "transformControls",
            ({ mode }: TransformControlsPayload) =>
                mode === "scale" && addConfigAreaLightSystem(this)
        )
        addAreaLightIntensitySystem(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        deleteAreaLightIntensitySystem(this)
    }

    public override get color() {
        return super.color
    }
    public override set color(val) {
        super.color = val
        addConfigAreaLightSystem(this)
    }

    public intensity = 1

    public override get width() {
        return super.width
    }
    public override set width(val) {
        super.width = val
        addConfigAreaLightSystem(this)
    }

    public override get height() {
        return super.height
    }
    public override set height(val) {
        super.height = val
        addConfigAreaLightSystem(this)
    }

    public override get scaleX() {
        return super.scaleX
    }
    public override set scaleX(val) {
        super.scaleX = val
        addConfigAreaLightSystem(this)
    }

    public override get scaleY() {
        return super.scaleY
    }
    public override set scaleY(val) {
        super.scaleY = val
        addConfigAreaLightSystem(this)
    }

    public override get depth() {
        return 0
    }
    public override set depth(_) {}
    public override get scaleZ() {
        return 0
    }
    public override set scaleZ(_) {}

    public override get castShadow() {
        return false
    }
    public override set castShadow(_) {}

    public enabled = true

    public override get visible() {
        return this.object3d.visible
    }
    public override set visible(val) {
        this.object3d.visible = val
    }
}
