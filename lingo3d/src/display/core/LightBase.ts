import { Reactive } from "@lincode/reactivity"
import { assertExhaustive } from "@lincode/utils"
import {
    DirectionalLightHelper,
    Light,
    PointLightHelper,
    SpotLightHelper
} from "three"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"
import scene from "../../engine/scene"
import { SHADOW_BIAS } from "../../globals"
import ILightBase, { CastShadow } from "../../interface/ILightBase"
import { getEditorHelper } from "../../states/useEditorHelper"
import {
    getShadowResolution,
    ShadowResolution
} from "../../states/useShadowResolution"
import HelperSprite from "./utils/HelperSprite"
import ObjectManager from "./ObjectManager"
import { addUpdateSystem, deleteUpdateSystem } from "../../systems/updateSystem"
import { Cancellable } from "@lincode/promiselikes"
import { addSelectionHelper } from "./utils/raycast/addSelectionHelper"

export const mapShadowResolution = (val: ShadowResolution) => {
    switch (val) {
        case "low":
            return 512
        case "medium":
            return 1024
        case "high":
            return 2048
        default:
            assertExhaustive(val)
    }
}

export default abstract class LightBase<T extends Light>
    extends ObjectManager<T>
    implements ILightBase
{
    public constructor(
        light: T,
        Helper?:
            | typeof DirectionalLightHelper
            | typeof SpotLightHelper
            | typeof PointLightHelper
            | typeof RectAreaLightHelper
    ) {
        super(light)

        this.createEffect(() => {
            if (!getEditorHelper() || !this.helperState.get()) return

            const sprite = new HelperSprite("light")
            const handle = addSelectionHelper(sprite, this)
            if (Helper) {
                const helper = new Helper(light as any)
                scene.add(helper)
                helper.add(sprite.outerObject3d)
                "update" in helper && addUpdateSystem(helper)

                handle.then(() => {
                    helper.dispose()
                    scene.remove(helper)
                    "update" in helper && deleteUpdateSystem(helper)
                })
            }
            return () => {
                handle.cancel()
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

    protected shadowBiasCoeff = 1
    private _castShadow: CastShadow = false
    public get castShadow() {
        return this._castShadow
    }
    public set castShadow(val) {
        this._castShadow = val

        const light = this.object3d
        light.castShadow = !!val
        light.shadow.bias = SHADOW_BIAS * this.shadowBiasCoeff

        this.cancelHandle(
            "castShadow",
            val === true
                ? () =>
                      getShadowResolution((res) =>
                          light.shadow.mapSize.setScalar(
                              mapShadowResolution(res)
                          )
                      )
                : val === "static"
                ? () => {
                      const handle = getShadowResolution((res) =>
                          light.shadow.mapSize.setScalar(
                              mapShadowResolution(res)
                          )
                      )
                      return new Cancellable(() => {
                          handle.cancel()
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
