import { RectAreaLight } from "three"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"
import IAreaLight, {
    areaLightDefaults,
    areaLightSchema
} from "../../interface/IAreaLight"
import { lazy } from "@lincode/utils"
import ObjectManager from "../core/ObjectManager"
import scene from "../../engine/scene"
import { Reactive } from "@lincode/reactivity"
import { ShadowResolution } from "../../states/useShadowResolution"
import Nullable from "../../interface/utils/Nullable"
import { ssrExcludeSet } from "../../engine/renderLoop/effectComposer/ssrEffect/renderSetup"
import selectionCandidates, {
    additionalSelectionCandidates
} from "../core/utils/raycast/selectionCandidates"
import { setManager } from "../../api/utils/getManager"
import { CM2M } from "../../globals"
import { getEditorHelper } from "../../states/useEditorHelper"

const lazyInit = lazy(async () => {
    const { RectAreaLightUniformsLib } = await import(
        "three/examples/jsm/lights/RectAreaLightUniformsLib"
    )
    RectAreaLightUniformsLib.init()
})

export default class AreaLight extends ObjectManager implements IAreaLight {
    public static componentName = "areaLight"
    public static defaults = areaLightDefaults
    public static schema = areaLightSchema

    private light?: RectAreaLight

    public constructor() {
        super()

        lazyInit().then(() => {
            if (this.done) return

            const light = (this.light = new RectAreaLight(
                this._color,
                this._intensity,
                this.width * this.scaleX * CM2M,
                this.height * this.scaleY * CM2M
            ))
            this.object3d.add(light)

            this.then(() => light.dispose())

            this.onTransformControls = (_, mode) => {
                if (mode !== "scale") return
                const { x, y } = this.outerObject3d.scale
                this.scaleX = x
                this.scaleY = y
            }

            this.createEffect(() => {
                if (!getEditorHelper() || !this.helperState.get()) return

                const helper = new RectAreaLightHelper(light)
                scene.add(helper)
                ssrExcludeSet.add(helper)
                setManager(helper, this)

                selectionCandidates.add(helper)
                additionalSelectionCandidates.add(helper)

                return () => {
                    helper.dispose()
                    scene.remove(helper)
                    ssrExcludeSet.delete(helper)

                    selectionCandidates.delete(helper)
                    additionalSelectionCandidates.delete(helper)
                }
            }, [this.helperState.get, getEditorHelper])
        })
    }

    public shadowResolution: Nullable<ShadowResolution>

    private helperState = new Reactive(true)
    public get helper() {
        return this.helperState.get()
    }
    public set helper(val) {
        this.helperState.set(val)
    }

    private _color?: string
    public get color() {
        return this._color ?? "#ffffff"
    }
    public set color(val) {
        this._color = val
        this.light?.color.set(val)
    }

    private _intensity?: number
    public get intensity() {
        return this._intensity ?? 1
    }
    public set intensity(val) {
        this._intensity = val
        this.light && (this.light.intensity = val)
    }

    private _width?: number
    public override get width() {
        return this._width ?? 100
    }
    public override set width(val) {
        this._width = val
        this.light && (this.light.width = val * this.scaleX * CM2M)
    }

    private _height?: number
    public override get height() {
        return this._height ?? 100
    }
    public override set height(val) {
        this._height = val
        this.light && (this.light.height = val * this.scaleY * CM2M)
    }

    private _scaleX?: number
    public override get scaleX() {
        return this._scaleX ?? 1
    }
    public override set scaleX(val) {
        this._scaleX = val
        this.light && (this.light.width = val * this.width * CM2M)
    }

    private _scaleY?: number
    public override get scaleY() {
        return this._scaleY ?? 1
    }
    public override set scaleY(val) {
        this._scaleY = val
        this.light && (this.light.height = val * this.height * CM2M)
    }

    public override get depth() {
        return 0
    }
    public override set depth(_) {}
    public override get scaleZ() {
        return 0
    }
    public override set scaleZ(_) {}

    private _castShadow?: boolean
    public get castShadow() {
        return !!this._castShadow
    }
    public set castShadow(val) {
        this._castShadow = val
    }
}
