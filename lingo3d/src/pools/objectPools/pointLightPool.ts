import PointLight from "../../display/lights/PointLight"
import scene from "../../engine/scene"
import createObjectPool from "../utils/createObjectPool"

export const [requestPointLight, releasePointLight, disposePointLights] =
    createObjectPool<PointLight, []>(
        () => {
            const light = new PointLight()
            light.disableSceneGraph = true
            light.disableSerialize = true
            light.intensity = 0
            return light
        },
        (light) => {
            light.dispose()
            scene.remove(light.outerObject3d)
        }
    )
