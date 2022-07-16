import { Light, OrthographicCamera } from "three"
import { ORTHOGRAPHIC_FRUSTUM } from "../globals"
import { getResolution } from "../states/useResolution"
import { camFar } from "./constants"

export default <T extends Light>(light: T) => {
    light.castShadow = true
    light.shadow.bias = -0.001
    light.shadow.mapSize.width = 512
    light.shadow.mapSize.height = 512
    return light
}
