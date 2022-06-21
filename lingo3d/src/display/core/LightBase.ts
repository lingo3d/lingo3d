import { Cancellable } from "@lincode/promiselikes"
import { Class } from "@lincode/utils"
import { Color, Light, Object3D } from "three"
import mainCamera from "../../engine/mainCamera"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import { emitSelectionTarget, onSelectionTarget } from "../../events/onSelectionTarget"
import ILightBase from "../../interface/ILightBase"
import { getCameraRendered } from "../../states/useCameraRendered"
import ObjectManager from "./ObjectManager"
import makeLightSprite from "./utils/makeLightSprite"

export default abstract class LightBase<T extends Light> extends ObjectManager<T> implements ILightBase {
    public constructor(light: T, Helper?: Class<Object3D & { dispose: () => void }>) {
        super(light)

        this.createEffect(() => {
            if (getCameraRendered() !== mainCamera) return

            const handle = new Cancellable()

            const sprite = makeLightSprite()
            handle.watch(onSelectionTarget(({ target }) => {
                target === sprite && emitSelectionTarget(this)
            }))

            if (Helper) {
                const helper = new Helper(this.object3d)
                scene.add(helper)
                helper.add(sprite.outerObject3d)

                if ("update" in helper)
                    handle.watch(onBeforeRender(() => {
                        //@ts-ignore
                        helper.update()
                    }))
                
                handle.then(() => {
                    helper.dispose()
                    scene.remove(helper)
                })
            }
            else this.outerObject3d.add(sprite.outerObject3d)
            
            return () => {
                sprite.dispose()
                handle.cancel()
            }
        }, [getCameraRendered])
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        this.object3d.dispose()
        return this
    }

    public get color() {
        return "#" + this.object3d.color.getHexString()
    }
    public set color(val: string) {
        this.object3d.color = new Color(val)
    }

    public get intensity() {
        return this.object3d.intensity
    }
    public set intensity(val: number) {
        this.object3d.intensity = val
    }
}