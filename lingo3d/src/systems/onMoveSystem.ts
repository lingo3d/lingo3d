import { Object3D } from "three"
import renderSystemWithData from "./utils/renderSystemWithData"
import { positionChanged } from "../cachedUtils/positionChanged"

export const [addOnMoveSystem, deleteOnMoveSystem] = renderSystemWithData(
    (item: Object3D, data: { cb: () => void }) => {
        positionChanged(item) && data.cb()
    }
)
