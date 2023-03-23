import { RectAreaLight } from "three"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"
import IAreaLight, {
    areaLightDefaults,
    areaLightSchema
} from "../../interface/IAreaLight"
import { lazy } from "@lincode/utils"
import SimpleObjectManager from "../core/SimpleObjectManager"
import scene from "../../engine/scene"
import { Reactive } from "@lincode/reactivity"
import { ssrExcludeSet } from "../../engine/renderLoop/effectComposer/ssrEffect/renderSetup"
import selectionCandidates, {
    additionalSelectionCandidates
} from "../core/utils/raycast/selectionCandidates"
import { setManager } from "../../api/utils/getManager"
import { getEditorHelper } from "../../states/useEditorHelper"

const lazyInit = lazy(async () => {
    const { RectAreaLightUniformsLib } = await import(
        "three/examples/jsm/lights/RectAreaLightUniformsLib"
    )
    RectAreaLightUniformsLib.init()
})

export default class AreaLight
    extends SimpleObjectManager
    implements IAreaLight
{
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
                this.scaleX,
                this.scaleY
            ))
            this.object3d.add(light)

            this.then(() => light.dispose())
            this.watch(this.enabledState.get((val) => (light.visible = val)))

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

    private _scaleX?: number
    public override get scaleX() {
        return this._scaleX ?? 1
    }
    public override set scaleX(val) {
        this._scaleX = val
        this.light && (this.light.width = val)
    }

    private _scaleY?: number
    public override get scaleY() {
        return this._scaleY ?? 1
    }
    public override set scaleY(val) {
        this._scaleY = val
        this.light && (this.light.height = val)
    }

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

    private enabledState = new Reactive(true)
    public get enabled() {
        return this.enabledState.get()
    }
    public set enabled(val) {
        this.enabledState.set(val)
    }
}
