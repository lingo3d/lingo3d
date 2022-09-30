import { forceGet } from "@lincode/utils"
import { Effect } from "postprocessing"
import { Camera } from "three"

const cameraEffectMap = new WeakMap<Camera, Effect>()

export default <T extends Effect>(
    camera: Camera,
    factory: (cam: Camera) => T
) =>
    forceGet(cameraEffectMap, camera, () => {
        const result = factory(camera)
        camera.userData.manager.then(() => result.dispose())
        return result
    }) as T
