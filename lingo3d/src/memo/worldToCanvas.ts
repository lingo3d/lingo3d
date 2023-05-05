import { Object3D } from "three"
import { container } from "../engine/renderLoop/containers"
import getCenter from "./getCenter"
import { vector2 } from "../display/utils/reusables"
import computeClonePerFrame from "./utils/computeClonePerFrame"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"

export default computeClonePerFrame((target: Object3D) => {
    const center = getCenter(target)
    center.project(cameraRenderedPtr[0])
    return vector2.set(
        (center.x * 0.5 + 0.5) * container.offsetWidth,
        (center.y * -0.5 + 0.5) * container.offsetHeight
    )
})
