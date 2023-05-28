import MeshAppendable from "../display/core/MeshAppendable"
import gameSystem from "./utils/gameSystem"

export const orbitCameraPlaceAtSystem = gameSystem({
    data: {} as { target: MeshAppendable },
    update: (manager: MeshAppendable, data) =>
        manager.placeAt(data.target.getCenter())
})
