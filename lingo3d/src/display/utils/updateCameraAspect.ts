import { Camera, PerspectiveCamera, OrthographicCamera } from "three"
import { ORTHOGRAPHIC_FRUSTUM } from "../../globals"
import { getResolution } from "../../states/useResolution"
import { getWebXR } from "../../states/useWebXR"

export default (camera: Camera) => {
    const [resX, resY] = getResolution()
    const aspect = resX / resY

    if (camera instanceof PerspectiveCamera && !getWebXR()) {
        camera.aspect = aspect
        camera.updateProjectionMatrix()
    } else if (camera instanceof OrthographicCamera) {
        ;[camera.left, camera.right, camera.top, camera.bottom] = [
            aspect * ORTHOGRAPHIC_FRUSTUM * -0.5,
            aspect * ORTHOGRAPHIC_FRUSTUM * 0.5,
            ORTHOGRAPHIC_FRUSTUM * 0.5,
            ORTHOGRAPHIC_FRUSTUM * -0.5
        ]
        camera.updateProjectionMatrix()
    }

    return [resX, resY, aspect]
}
