import { Object3D } from "three"
import { container } from "../engine/renderLoop/containers"
import { vector2 } from "../display/utils/reusables"
import computeClonePerFrame from "./utils/computeClonePerFrame"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import getWorldPosition from "./getWorldPosition"

export default computeClonePerFrame((target: Object3D) => {
    const center = getWorldPosition(target)
    center.project(cameraRenderedPtr[0])
    return vector2.set(
        (center.x * 0.5 + 0.5) * container.offsetWidth,
        (center.y * -0.5 + 0.5) * container.offsetHeight
    )
})
