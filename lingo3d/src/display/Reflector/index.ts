import store from "@lincode/reactivity"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import { getCamera } from "../../states/useCamera"
import { getRenderer } from "../../states/useRenderer"
import Plane from "../primitives/Plane"

export default class Reflector extends Plane {
    public static override componentName = "reflector"

    public constructor() {
        super()
        this.rotationX = -90
        this.depth = 0.01

        const [setClass, getClass] = store<any>(undefined)
        import("./MeshReflectorMaterial").then(module => setClass(module.default))

        this.createEffect(() => {
            const MeshReflectorMaterial = getClass()
            if (!MeshReflectorMaterial) return

            const mat = this.object3d.material = new MeshReflectorMaterial(getRenderer(), getCamera(), scene, this.object3d, {
                resolution: 512,
                blur: [1024, 1024],
                mixBlur: 2.5,
                mixContrast: 1.5,
                mirror: 1
            })
            const handle = onBeforeRender(() => {
                mat.update()
            })
            return () => {
                mat.dispose()
                handle.cancel()
            }
        }, [getRenderer, getClass, getCamera])
    }
}