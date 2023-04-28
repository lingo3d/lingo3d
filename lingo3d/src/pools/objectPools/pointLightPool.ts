import PointLight from "../../display/lights/PointLight"
import createObjectPool from "../utils/createObjectPool"

export const [requestPointLight, releasePointLight] = createObjectPool<
    PointLight,
    []
>(() => {
    const light = new PointLight()
    light.disableSceneGraph = true
    light.disableSerialize = true
    light.intensity = 0
    return light
})
