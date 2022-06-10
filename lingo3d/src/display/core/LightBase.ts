import { Point3d } from "@lincode/math"
import { Class } from "@lincode/utils"
import { Color, Light, Object3D } from "three"
import mainCamera from "../../engine/mainCamera"
import scene from "../../engine/scene"
import { emitSelectionTarget, onSelectionTarget } from "../../events/onSelectionTarget"
import ILightBase from "../../interface/ILightBase"
import { getCameraRendered } from "../../states/useCameraRendered"
import MeshItem from "./MeshItem"
import ObjectManager from "./ObjectManager"
import makeLightSprite from "./utils/makeLightSprite"

export default abstract class LightBase<T extends Light> extends ObjectManager<T> implements ILightBase {
    public constructor(light: T, Helper?: Class<Object3D & { dispose: () => void }>) {
        super(light)

        Helper && this.createEffect(() => {
            if (getCameraRendered() !== mainCamera) return

            const helper = new Helper(this.object3d)
            scene.add(helper)

            const sprite = makeLightSprite()
            helper.add(sprite.outerObject3d)

            const handle = onSelectionTarget(({ target }) => {
                target === sprite && emitSelectionTarget(this)
            })
            return () => {
                helper.dispose()
                scene.remove(helper)

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

    public override lookAt(target: MeshItem | Point3d) {
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