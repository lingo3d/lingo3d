import MeshAppendable from "../display/core/MeshAppendable"
import createInternalSystem from "./utils/createInternalSystem"

export const orbitCameraPlaceAtSystem = createInternalSystem(
    "orbitCameraPlaceAtSystem",
    {
        data: {} as { target: MeshAppendable },
        update: (manager: MeshAppendable, data) => manager.placeAt(data.target)
    }
)
