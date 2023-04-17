import MeshAppendable from "../api/core/MeshAppendable"
import renderSystemWithData from "./utils/renderSystemWithData"

export const [addPlaceAtSystem, deletePlaceAtSystem] = renderSystemWithData(
    (manager: MeshAppendable, data: { target: MeshAppendable }) =>
        manager.placeAt(data.target.getCenter())
)
