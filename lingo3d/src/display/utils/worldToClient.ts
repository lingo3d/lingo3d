import { Object3D, Vector2 } from "three"
import { container } from "../../engine/renderLoop/renderSetup"
import { getCameraRendered } from "../../states/useCameraRendered"
import computePerFrame from "../../utils/computePerFrame"
import getCenter from "./getCenter"

export default computePerFrame((target: Object3D) => {
    const center = getCenter(target)
    center.project(getCameraRendered())
    return new Vector2(
        (center.x * 0.5 + 0.5) * container.clientWidth,
        (center.y * -0.5 + 0.5) * container.clientHeight
    )
})
