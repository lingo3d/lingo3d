import { Reactive } from "@lincode/reactivity"
import { assertExhaustive } from "@lincode/utils"
import {
    DirectionalLightHelper,
    Group,
    Light,
    PointLightHelper,
    SpotLightHelper
} from "three"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"
import scene from "../../engine/scene"
import { SHADOW_BIAS } from "../../globals"
import ILightBase from "../../interface/ILightBase"
import { getEditorHelper } from "../../states/useEditorHelper"
import {
    getShadowResolution,
    ShadowResolution
} from "../../states/useShadowResolution"
import ObjectManager from "./ObjectManager"
import { addSelectionHelper } from "./utils/raycast/selectionCandidates"
import HelperSprite from "./utils/HelperSprite"
import { addUpdateSystem, deleteUpdateSystem } from "./utils/updateSystem"

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

export default abstract class LightBase<T extends typeof Light>
    extends ObjectManager<Group>
    implements ILightBase
{
    protected lightState = new Reactive<InstanceType<T> | undefined>(undefined)

    public constructor(
        Light: T,
        Helper?:
            | typeof DirectionalLightHelper
            | typeof SpotLightHelper
            | typeof PointLightHelper
            | typeof RectAreaLightHelper
    ) {
        super()

        this.createEffect(() => {
            const light = new Light()
            this.lightState.set(light as InstanceType<T>)
            this.object3d.add(light)

            if (light.shadow && this.castShadowState.get()) {
                light.castShadow = true
                light.shadow.bias = SHADOW_BIAS

                light.shadow.mapSize.setScalar(
                    mapShadowResolution(getShadowResolution())
                )
            }
            return () => {
                this.object3d.remove(light)
                light.dispose()
            }
        }, [this.castShadowState.get, getShadowResolution])

        this.createEffect(() => {
            const light = this.lightState.get()
            if (!getEditorHelper() || !this.helperState.get() || !light) return

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
        }, [getEditorHelper, this.helperState.get, this.lightState.get])
    }

    public get enabled() {
        const light = this.lightState.get()
        if (!light) return true

        return light.visible
    }
    public set enabled(val) {
        this.cancelHandle("enabled", () =>
            this.lightState.get((light) => light && (light.visible = val))
        )
    }

    protected helperState = new Reactive(true)
    public get helper() {
        return this.helperState.get()
    }
    public set helper(val) {
        this.helperState.set(val)
    }

    protected castShadowState = new Reactive(false)
    public get castShadow() {
        return this.castShadowState.get()
    }
    public set castShadow(val) {
        this.castShadowState.set(val)
    }

    public get color() {
        const light = this.lightState.get()
        if (!light) return "#ffffff"

        return "#" + light.color.getHexString()
    }
    public set color(val) {
        this.cancelHandle("color", () =>
            this.lightState.get((light) => light?.color.set(val))
        )
    }

    public get intensity() {
        const light = this.lightState.get()
        if (!light) return 1

        return light.intensity
    }
    public set intensity(val) {
        this.cancelHandle("intensity", () =>
            this.lightState.get((light) => light && (light.intensity = val))
        )
    }
}
