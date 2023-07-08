import MeshAppendable from "../display/core/MeshAppendable"
import getWorldPosition from "./getWorldPosition"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import computePerFrame from "./utils/computePerFrame"

export const getDistanceFromCamera = computePerFrame((self: MeshAppendable) =>
    getWorldPosition(self.$object).distanceTo(
        getWorldPosition(cameraRenderedPtr[0])
    )
)
