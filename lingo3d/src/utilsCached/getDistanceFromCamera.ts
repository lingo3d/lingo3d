import MeshAppendable from "../api/core/MeshAppendable"
import getWorldPosition from "../display/utils/getWorldPosition"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import computePerFrame from "../utils/computePerFrame"

export const getDistanceFromCamera = computePerFrame((self: MeshAppendable) =>
    getWorldPosition(self.outerObject3d).distanceTo(
        getWorldPosition(cameraRenderedPtr[0])
    )
)
