import { Class } from "@lincode/utils"
import { Color, Light, Object3D } from "three"
import PositionedItem from "../../api/core/PositionedItem"
import Point3d from "../../api/Point3d"
import mainCamera from "../../engine/mainCamera"
import scene from "../../engine/scene"
import { emitSelectionTarget, onSelectionTarget } from "../../events/onSelectionTarget"
import ILightBase from "../../interface/ILightBase"
import { getCamera } from "../../states/useCamera"
import ObjectManager from "./ObjectManager"
import makeLightSprite from "./utils/makeLightSprite"

export default abstract class LightBase<T extends Light> extends ObjectManager<T> implements ILightBase {
    public constructor(light: T, Helper?: Class<Object3D & { dispose: () => void }>) {
        super(light)

        Helper && this.createEffect(() => {
            if (getCamera() !== mainCamera) return

            const helper = new Helper(this.object3d)
            scene.add(helper)

            const sprite = makeLightSprite()
            helper.add(sprite.outerObject3d)

            const handle = onSelectionTarget(target => {
                target === sprite && emitSelectionTarget(this)
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
        super.dispose()
        this.object3d.dispose()
        return this
    }

    public override lookAt(target: PositionedItem | Point3d) {
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

    public override getCenter() {
        return this.getWorldPosition()
    }
}