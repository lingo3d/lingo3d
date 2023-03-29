import { Water } from "three/examples/jsm/objects/Water"
import { dtPtr } from "../engine/eventLoop"
import renderSystemWithData from "./utils/renderSystemWithData"

export const [addWaterSystem, deleteWaterSystem] = renderSystemWithData(
    (water: Water, data: { speed: number }) =>
        (water.material.uniforms["time"].value += dtPtr[0] * data.speed)
)
