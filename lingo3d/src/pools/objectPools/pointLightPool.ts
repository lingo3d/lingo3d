import PointLight from "../../display/lights/PointLight"
import createObjectPool from "../utils/createObjectPool"

export const [requestPointLight, releasePointLight, disposePointLights] =
    createObjectPool<PointLight, []>(
        () => {
            const light = new PointLight()
            light.$ghost()
            light.intensity = 0
            return light
        },
        (light) => light.dispose()
    )
