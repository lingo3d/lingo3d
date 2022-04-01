import { Color, Group, RectAreaLight } from "three"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"
import IAreaLight, { areaLightDefaults } from "../../interface/IAreaLight"
import { lazy } from "@lincode/utils"
import ObjectManager from "../core/ObjectManager"
import { getCamera } from "../../states/useCamera"
import { getLightHelper } from "../../states/useLightHelper"
import mainCamera from "../../engine/mainCamera"
import scene from "../../engine/scene"
import SimpleObjectManager from "../core/SimpleObjectManager"
import Point3d from "../../api/Point3d"
import { scaleDown } from "../../engine/constants"

const lazyInit = lazy(async () => {
    const { RectAreaLightUniformsLib } = await import("three/examples/jsm/lights/RectAreaLightUniformsLib.js")
    RectAreaLightUniformsLib.init()
})

export default class extends ObjectManager<Group> implements IAreaLight {
    public static componentName = "areaLight"
    public static defaults = areaLightDefaults

    private light?: RectAreaLight

    public constructor() {
        super(new Group())

        ;(async () => {
            await lazyInit()

            if (this.done) return

            const light = this.light = new RectAreaLight(
                this._color,
                this._intensity,
                this.width * this.scaleX * scaleDown,
                this.height * this.scaleY * scaleDown
            )
            this._power && (light.power = this._power)
            this.object3d.add(light)

            this.then(() => light.dispose())

            this.createEffect(() => {
                if (!getLightHelper() || getCamera() !== mainCamera)
                    return
    
                const helper = new RectAreaLightHelper(light)
                scene.add(helper)
    
                return () => {
                    helper.dispose()
                    scene.remove(helper)
                }
            }, [getCamera, getLightHelper])
        })()
    }

    public override lookAt(target: SimpleObjectManager | Point3d) {
        super.lookAt(target)
        this.rotationY += 180
    }

    private _color?: string
    public get color() {
        return this._color ?? areaLightDefaults.color
    }
    public set color(val: string) {
        this._color = val
        this.light && (this.light.color = new Color(val))
    }

    private _intensity?: number
    public get intensity() {
        return this._intensity ?? areaLightDefaults.intensity
    }
    public set intensity(val: number) {
        this._intensity = val
        this.light && (this.light.intensity = val)
    }

    private _power?: number
    public get power() {
        return this._power ?? areaLightDefaults.power
    }
    public set power(val: number) {
        this._power = val
        this.light && (this.light.power = val)
    }

    private _width?: number
    public override get width() {
        return this._width ?? areaLightDefaults.width
    }
    public override set width(val: number) {
        this._width = val
        this.light && (this.light.width = val * this.scaleX * scaleDown)
    }

    private _height?: number
    public override get height() {
        return this._height ?? areaLightDefaults.height
    }
    public override set height(val: number) {
        this._height = val
        this.light && (this.light.height = val * this.scaleY * scaleDown)
    }

    public override get depth() {
        return areaLightDefaults.depth
    }
    public override set depth(val: number) {
    }

    private _scaleX?: number
    public override get scaleX() {
        return this._scaleX ?? areaLightDefaults.scaleX
    }
    public override set scaleX(val: number) {
        this._scaleX = val
        this.light && (this.light.width = val * this.width * scaleDown)
    }

    private _scaleY?: number
    public override get scaleY() {
        return this._scaleY ?? areaLightDefaults.scaleY
    }
    public override set scaleY(val: number) {
        this._scaleY = val
        this.light && (this.light.height = val * this.height * scaleDown)
    }

    public override get scaleZ() {
        return areaLightDefaults.scaleZ
    }
    public override set scaleZ(val: number) {
    }
}