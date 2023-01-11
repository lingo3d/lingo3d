import { Object3D } from "three"
import { container } from "../../engine/renderLoop/renderSetup"
import { getCameraRendered } from "../../states/useCameraRendered"
import computePerFrame from "../../utils/computePerFrame"
import getCenter from "./getCenter"
import { vector2 } from "./reusables"

export default computePerFrame((target: Object3D) => {
    const center = getCenter(target)
    center.project(getCameraRendered())
    return vector2.set(
        (center.x * 0.5 + 0.5) * container.clientWidth,
        (center.y * -0.5 + 0.5) * container.clientHeight
    )
})
