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
import mainCamera from "../../engine/mainCamera"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import { SHADOW_BIAS } from "../../globals"
import ILightBase from "../../interface/ILightBase"
import { getCameraRendered } from "../../states/useCameraRendered"
import {
    getShadowResolution,
    ShadowResolution
} from "../../states/useShadowResolution"
import ObjectManager from "./ObjectManager"
import { addSelectionHelper } from "./StaticObjectManager/raycast/selectionCandidates"
import HelperSprite from "./utils/HelperSprite"

export const mapShadowResolution = (val: ShadowResolution) => {
    switch (val) {
        case "low":
            return 256
        case "medium":
            return 512
        case "high":
            return 1024
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
                    mapShadowResolution(
                        this.shadowResolutionState.get() ??
                            getShadowResolution()
                    )
                )
            }
            return () => {
                this.object3d.remove(light)
                light.dispose()
            }
        }, [
            this.castShadowState.get,
            this.shadowResolutionState.get,
            getShadowResolution
        ])

        this.createEffect(() => {
            const light = this.lightState.get()
            if (
                getCameraRendered() !== mainCamera ||
                !this.helperState.get() ||
                !light
            )
                return

            const sprite = new HelperSprite("light")
            const handle = addSelectionHelper(sprite, this)
            if (Helper) {
                const helper = new Helper(light as any)
                scene.add(helper)
                helper.add(sprite.outerObject3d)

                if ("update" in helper)
                    handle.watch(onBeforeRender(() => helper.update()))

                handle.then(() => {
                    helper.dispose()
                    scene.remove(helper)
                })
            }
            return () => {
                handle.cancel()
            }
        }, [getCameraRendered, this.helperState.get, this.lightState.get])
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

    protected shadowResolutionState = new Reactive<
        ShadowResolution | undefined
    >(undefined)
    public get shadowResolution() {
        return this.shadowResolutionState.get()
    }
    public set shadowResolution(val) {
        this.shadowResolutionState.set(val)
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
