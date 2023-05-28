import Reflector from "../display/Reflector"
import MeshReflectorMaterial from "../display/Reflector/MeshReflectorMaterial"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import gameSystem from "./utils/gameSystem"

export const reflectorSystem = gameSystem({
    data: {} as { material: MeshReflectorMaterial },
    update: (_: Reflector, data) => {
        cameraRenderedPtr[0].updateWorldMatrix(true, false)
        data.material.update()
    },
    ticker: "render"
})
