import { Light } from "three"

export default <T extends Light>(light: T) => {
    if (light.shadow) {
        light.castShadow = true
        light.shadow.bias = -0.00009
        light.shadow.mapSize.width = 512
        light.shadow.mapSize.height = 512
    }
    return light
}
