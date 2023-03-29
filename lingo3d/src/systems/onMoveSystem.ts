import { Object3D } from "three"
import { positionChanged } from "../display/utils/trackObject"
import renderSystemWithData from "./utils/renderSystemWithData"

export const [addOnMoveSystem, deleteOnMoveSystem] = renderSystemWithData(
    (item: Object3D, data: { cb: () => void }) => {
        positionChanged(item) && data.cb()
    }
)
