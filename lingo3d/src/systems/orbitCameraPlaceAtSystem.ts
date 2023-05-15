import MeshAppendable from "../display/core/MeshAppendable"
import renderSystemWithData from "./utils/renderSystemWithData"

export const [addOrbitCameraPlaceAtSystem, deleteOrbitCameraPlaceAtSystem] =
    renderSystemWithData(
        (manager: MeshAppendable, data: { target: MeshAppendable }) =>
            manager.placeAt(data.target.getCenter())
    )
