import { Class } from "@lincode/utils"
import { Color, Light, Object3D } from "three"
import Point3d from "../../api/Point3d"
import mainCamera from "../../engine/mainCamera"
import scene from "../../engine/scene"
import ILightBase from "../../interface/ILightBase"
import { getCamera } from "../../states/useCamera"
import { getSelectionTarget, setSelectionTarget } from "../../states/useSelectionTarget"
import ObjectManager from "./ObjectManager"
import SimpleObjectManager from "./SimpleObjectManager"
import makeLightSprite from "./utils/makeLightSprite"

export default abstract class LightBase<T extends Light> extends ObjectManager<T> implements ILightBase {
    public constructor(light: T, Helper?: Class<Object3D & { dispose: () => void }>) {
        super(light)

        Helper && this.createEffect(() => {
            if (getCamera() !== mainCamera)
                return

            const helper = new Helper(this.object3d)
            scene.add(helper)

            const sprite = makeLightSprite()
            helper.add(sprite.outerObject3d)

            const handle = getSelectionTarget(target => {
                target === sprite && this.queueMicrotask(() => setSelectionTarget(this))
            })
            return () => {
                helper.dispose()
                scene.remove(helper)

                sprite.dispose()
                handle.cancel()
            }
        }, [getCamera])
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        this.object3d.dispose()
        return this
    }

    public override lookAt(target: SimpleObjectManager | Point3d) {
        super.lookAt(target)
        this.rotationY += 180
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