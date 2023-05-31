import MeshAppendable from "../display/core/MeshAppendable"
import createSystem from "./utils/createSystem"

export const orbitCameraPlaceAtSystem = createSystem(
    "orbitCameraPlaceAtSystem",
    {
        data: {} as { target: MeshAppendable },
        update: (manager: MeshAppendable, data) =>
            manager.placeAt(data.target.getCenter())
    }
)
