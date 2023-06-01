import { DirectionalLightHelper, Light, SpotLightHelper } from "three"
import scene from "../../engine/scene"
import ILightBase from "../../interface/ILightBase"
import { getEditorHelper } from "../../states/useEditorHelper"
import HelperSprite from "./utils/HelperSprite"
import GimbalObjectManager from "./GimbalObjectManager"
import { ColorString } from "../../interface/ITexturedStandard"
import { ssrExcludeSet } from "../../collections/ssrExcludeSet"
import { renderCheckExcludeSet } from "../../collections/renderCheckExcludeSet"
import { updateSystem } from "../../systems/updateSystem"

export default abstract class LightBase<T extends Light>
    extends GimbalObjectManager<T>
    implements ILightBase
{
    public constructor(
        light: T,
        Helper?: typeof DirectionalLightHelper | typeof SpotLightHelper
    ) {
        super(light)
        this.createEffect(() => {
            if (!getEditorHelper() || this.$disableSceneGraph) return

            const sprite = new HelperSprite("light", this)
            if (Helper) {
                const helper = new Helper(light as any)
                ssrExcludeSet.add(helper)
                renderCheckExcludeSet.add(helper)
                scene.add(helper)
                helper.add(sprite.outerObject3d)
                "update" in helper && updateSystem.add(helper)

                sprite.then(() => {
                    helper.dispose()
                    ssrExcludeSet.delete(helper)
                    renderCheckExcludeSet.delete(helper)
                    scene.remove(helper)
                    "update" in helper && updateSystem.delete(helper)
                })
            }
            return () => {
                sprite.dispose()
            }
        }, [getEditorHelper])
    }

    protected override disposeNode() {
        super.disposeNode()
        this.object3d.dispose()
    }

    public get color() {
        return ("#" + this.object3d.color.getHexString()) as ColorString
    }
    public set color(val: ColorString) {
        this.object3d.color.set(val)
    }

    public get intensity() {
        return this.object3d.intensity
    }
    public set intensity(val) {
        this.object3d.intensity = val
    }
}
