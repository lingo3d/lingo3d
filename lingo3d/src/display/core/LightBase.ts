import { Reactive } from "@lincode/reactivity"
import {
    DirectionalLightHelper,
    Light,
    PointLightHelper,
    SpotLightHelper
} from "three"
import scene from "../../engine/scene"
import ILightBase, { CastShadow } from "../../interface/ILightBase"
import { getEditorHelper } from "../../states/useEditorHelper"
import HelperSprite from "./utils/HelperSprite"
import ObjectManager from "./ObjectManager"
import { addUpdateSystem, deleteUpdateSystem } from "../../systems/updateSystem"
import { Cancellable } from "@lincode/promiselikes"
import {
    addShadowPhysicsSystem,
    deleteShadowPhysicsSystem
} from "../../systems/shadowPhysicsSystem"
import {
    addShadowResolutionSystem,
    deleteShadowResolutionSystem
} from "../../systems/shadowResolutionSystem"

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
                scene.add(helper)
                helper.add(sprite.outerObject3d)
                "update" in helper && addUpdateSystem(helper)

                sprite.then(() => {
                    helper.dispose()
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

    public get enabled() {
        return this.object3d.visible
    }
    public set enabled(val) {
        this.object3d.visible = val
    }

    protected helperState = new Reactive(true)
    public get helper() {
        return this.helperState.get()
    }
    public set helper(val) {
        this.helperState.set(val)
    }

    public shadowBiasCoeff = 1
    private _castShadow: CastShadow = false
    public get castShadow() {
        return this._castShadow
    }
    public set castShadow(val) {
        this._castShadow = val

        const light = this.object3d
        light.castShadow = !!val

        this.cancelHandle(
            "castShadowResolution",
            val &&
                light.shadow &&
                (() => {
                    addShadowResolutionSystem(this as any, { step: undefined })
                    return new Cancellable(() =>
                        deleteShadowResolutionSystem(this as any)
                    )
                })
        )

        this.cancelHandle(
            "castShadow",
            val === "physics"
                ? () => {
                      light.shadow.autoUpdate = false
                      "distance" in this &&
                          addShadowPhysicsSystem(this as any, { count: 0 })
                      return new Cancellable(() => {
                          light.shadow.autoUpdate = true
                          "distance" in this &&
                              deleteShadowPhysicsSystem(this as any)
                      })
                  }
                : undefined
        )
    }

    public get color() {
        return "#" + this.object3d.color.getHexString()
    }
    public set color(val) {
        this.object3d.color.set(val)
    }

    public get intensity() {
        return this.object3d.intensity
    }
    public set intensity(val) {
        this.object3d.intensity = val
    }
}
