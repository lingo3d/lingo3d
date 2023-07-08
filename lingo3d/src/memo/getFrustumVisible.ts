import MeshAppendable from "../display/core/MeshAppendable"
import getFrustum from "./getFrustum"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import getWorldPosition from "./getWorldPosition"
import computePerFrame from "./utils/computePerFrame"

export default computePerFrame((target: MeshAppendable) =>
    getFrustum(cameraRenderedPtr[0]).containsPoint(
        getWorldPosition(target.$innerObject)
    )
)
