import { Cancellable } from "@lincode/promiselikes"
import { Class } from "@lincode/utils"
import { Color, Group, Light, Object3D } from "three"
import mainCamera from "../../engine/mainCamera"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import {
    emitSelectionTarget,
    onSelectionTarget
} from "../../events/onSelectionTarget"
import ILightBase from "../../interface/ILightBase"
import { getCameraRendered } from "../../states/useCameraRendered"
import ObjectManager from "./ObjectManager"
import makeLightSprite from "./utils/makeLightSprite"

export default abstract class LightBase<T extends typeof Light>
    extends ObjectManager<Group>
    implements ILightBase
{
    protected light: InstanceType<T>

    public constructor(
        Light: T,
        Helper?: Class<Object3D & { dispose: () => void }>
    ) {
        const group = new Group()
        super(group)

        //@ts-ignore
        const light = this.light = new Light()
        group.add(light)
        this.then(() => light.dispose())

        if (light.shadow) {
            light.castShadow = true
            light.shadow.bias = -0.00009
            light.shadow.mapSize.width = 512
            light.shadow.mapSize.height = 512
        }

        this.createEffect(() => {
            if (getCameraRendered() !== mainCamera) return

            const handle = new Cancellable()

            const sprite = makeLightSprite()
            handle.watch(
                onSelectionTarget(({ target }) => {
                    target === sprite && emitSelectionTarget(this)
                })
            )

            if (Helper) {
                const helper = new Helper(this.object3d)
                scene.add(helper)
                helper.add(sprite.outerObject3d)

                if ("update" in helper)
                    handle.watch(
                        onBeforeRender(() => {
                            //@ts-ignore
                            helper.update()
                        })
                    )

                handle.then(() => {
                    helper.dispose()
                    scene.remove(helper)
                })
            } else this.outerObject3d.add(sprite.outerObject3d)

            return () => {
                sprite.dispose()
                handle.cancel()
            }
        }, [getCameraRendered])
    }

    public get color() {
        return "#" + this.light.color.getHexString()
    }
    public set color(val) {
        this.light.color = new Color(val)
    }

    public get intensity() {
        return this.light.intensity
    }
    public set intensity(val) {
        this.light.intensity = val
    }
}
