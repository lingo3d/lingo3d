import { Frustum, PerspectiveCamera } from "three"
import computePerFrame from "./utils/computePerFrame"
import { forceGetInstance } from "@lincode/utils"
import { matrix4 } from "../display/utils/reusables"

const cameraFrustumMap = new WeakMap<PerspectiveCamera, Frustum>()

export default computePerFrame((camera: PerspectiveCamera) => {
    const frustum = forceGetInstance(cameraFrustumMap, camera, Frustum)
    frustum.setFromProjectionMatrix(
        matrix4.multiplyMatrices(
            camera.projectionMatrix,
            camera.matrixWorldInverse
        )
    )
    return frustum
})
