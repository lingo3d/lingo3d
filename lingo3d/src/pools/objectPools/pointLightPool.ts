import PointLight from "../../display/lights/PointLight"
import createObjectPool from "../utils/createObjectPool"

export const [requestPointLight, releasePointLight, disposePointLights] =
    createObjectPool<PointLight, []>(
        () => {
            const light = new PointLight()
            light.intensity = 0
            light.$ghost()
            return light
        },
        (light) => light.dispose()
    )
