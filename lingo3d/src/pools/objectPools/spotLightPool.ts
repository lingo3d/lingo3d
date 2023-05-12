import SpotLight from "../../display/lights/SpotLight"
import createObjectPool from "../utils/createObjectPool"

export const [requestSpotLight, releaseSpotLight, disposeSpotLights] =
    createObjectPool<SpotLight, []>(
        () => {
            const light = new SpotLight()
            light.$ghost()
            light.intensity = 0
            return light
        },
        (light) => light.dispose()
    )
