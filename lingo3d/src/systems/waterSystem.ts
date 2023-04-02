import { Water } from "three/examples/jsm/objects/Water"
import renderSystemWithData from "./utils/renderSystemWithData"
import { dtPtr } from "../pointers/dtPtr"

export const [addWaterSystem, deleteWaterSystem] = renderSystemWithData(
    (water: Water, data: { speed: number }) =>
        (water.material.uniforms["time"].value += dtPtr[0] * data.speed)
)
