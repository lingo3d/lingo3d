import { Reactive } from "@lincode/reactivity"
import {
    DirectionalLightHelper,
    Light,
    PointLightHelper,
    SpotLightHelper
} from "three"
import scene from "../../engine/scene"
import ILightBase from "../../interface/ILightBase"
import { getEditorHelper } from "../../states/useEditorHelper"
import HelperSprite from "./utils/HelperSprite"
import ObjectManager from "./ObjectManager"
import { addUpdateSystem, deleteUpdateSystem } from "../../systems/updateSystem"
import { ColorString } from "../../interface/ITexturedStandard"
import { ssrExcludeSet } from "../../collections/ssrExcludeSet"

export default abstract class LightBase<T extends Light>
    extends ObjectManager<T>
    implements ILightBase
{
    public constructor(
        public light: T,
        Helper?:
            | typeof DirectionalLightHelper
            | typeof SpotLightHelper
            | typeof PointLightHelper
    ) {
        super(light)
        this.createEffect(() => {
            if (!getEditorHelper() || !this.helperState.get()) return

            const sprite = new HelperSprite("light", this)
            if (Helper) {
                const helper = new Helper(light as any)
                ssrExcludeSet.add(helper)
                scene.add(helper)
                helper.add(sprite.outerObject3d)
                "update" in helper && addUpdateSystem(helper)

                sprite.then(() => {
                    helper.dispose()
                    ssrExcludeSet.delete(helper)
                    scene.remove(helper)
                    "update" in helper && deleteUpdateSystem(helper)
                })
            }
            return () => {
                sprite.dispose()
            }
        }, [getEditorHelper, this.helperState.get])
    }

    protected override disposeNode() {
        super.disposeNode()
        this.object3d.dispose()
    }

    public _enabledFactor = true
    private _enabled = true
    public get enabled() {
        return this._enabled
    }
    public set enabled(val) {
        this._enabled = val
        this.object3d.visible = !!((val as any) * (this._enabledFactor as any))
    }

    protected helperState = new Reactive(true)
    public get helper() {
        return this.helperState.get()
    }
    public set helper(val) {
        this.helperState.set(val)
    }

    public get color() {
        return ("#" + this.object3d.color.getHexString()) as ColorString
    }
    public set color(val: ColorString) {
        this.object3d.color.set(val)
    }

    public _intensityFactor = 1
    private _intensity = 1
    public get intensity() {
        return this._intensity
    }
    public set intensity(val) {
        this._intensity = val
        this.object3d.intensity = val * this._intensityFactor
    }
}
