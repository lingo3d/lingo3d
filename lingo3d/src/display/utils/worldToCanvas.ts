import { Object3D } from "three"
import { container } from "../../engine/renderLoop/containers"
import { getCameraRendered } from "../../states/useCameraRendered"
import getCenter from "./getCenter"
import { vector2 } from "./reusables"
import computeClonePerFrame from "../../utils/computeClonePerFrame"

export default computeClonePerFrame((target: Object3D) => {
    const center = getCenter(target)
    center.project(getCameraRendered())
    return vector2.set(
        (center.x * 0.5 + 0.5) * container.offsetWidth,
        (center.y * -0.5 + 0.5) * container.offsetHeight
    )
})
