import { DirectionalLightHelper, Light, SpotLightHelper } from "three"
import scene from "../../engine/scene"
import ILightBase from "../../interface/ILightBase"
import HelperSprite from "./helperPrimitives/HelperSprite"
import GimbalObjectManager from "./GimbalObjectManager"
import { ColorString } from "../../interface/ITexturedStandard"
import { ssrExcludeSet } from "../../collections/ssrExcludeSet"
import { renderCheckExcludeSet } from "../../collections/renderCheckExcludeSet"
import { updateSystem } from "../../systems/updateSystem"
import { helperSystem } from "../../systems/eventSystems/helperSystem"
import { configHelperSystem } from "../../systems/configSystems/configHelperSystem"

export default abstract class LightBase<T extends Light>
    extends GimbalObjectManager<T>
    implements ILightBase
{
    public $createHelper() {
        const sprite = new HelperSprite("light", this)
        if (!this.Helper) return sprite

        const helper = new this.Helper(this.$innerObject as any)
        ssrExcludeSet.add(helper)
        renderCheckExcludeSet.add(helper)
        scene.add(helper)
        helper.add(sprite.$object)
        "update" in helper && updateSystem.add(helper)

        sprite.then(() => {
            helper.dispose()
            ssrExcludeSet.delete(helper)
            renderCheckExcludeSet.delete(helper)
            scene.remove(helper)
            "update" in helper && updateSystem.delete(helper)
        })
        return sprite
    }

    public constructor(
        light: T,
        private Helper?: typeof DirectionalLightHelper | typeof SpotLightHelper
    ) {
        super(light)
        helperSystem.add(this)
        configHelperSystem.add(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        this.$innerObject.dispose()
    }

    public get color() {
        return ("#" + this.$innerObject.color.getHexString()) as ColorString
    }
    public set color(val: ColorString) {
        this.$innerObject.color.set(val)
    }

    public get intensity() {
        return this.$innerObject.intensity
    }
    public set intensity(val) {
        this.$innerObject.intensity = val
    }
}
