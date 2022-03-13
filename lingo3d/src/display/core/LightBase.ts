import { createEffect } from "@lincode/reactivity"
import { Class } from "@lincode/utils"
import { Color, Light, Object3D } from "three"
import Point3d from "../../api/Point3d"
import mainCamera from "../../engine/mainCamera"
import scene from "../../engine/scene"
import { getCamera } from "../../states/useCamera"
import { getLightHelper } from "../../states/useLightHelper"
import ObjectManager from "./ObjectManager"
import SimpleObjectManager from "./SimpleObjectManager"

export default abstract class LightBase<T extends Light> extends ObjectManager<T> {
    public constructor(light: T, Helper?: Class<Object3D & { dispose: () => void }>) {
        super(light)

        Helper && this.watch(createEffect(() => {
            if (!getLightHelper() || getCamera() !== mainCamera)
                return

            const helper = new Helper(this.object3d)
            scene.add(helper)

            return () => {
                helper.dispose()
                scene.remove(helper)
            }
        }, [getCamera, getLightHelper]))
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