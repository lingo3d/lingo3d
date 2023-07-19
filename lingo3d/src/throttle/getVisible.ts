import { Object3D } from "three"
import throttleFrame from "./utils/throttleFrame"
import scene from "../engine/scene"

const getVisibleChildren = (
    object: Object3D = scene,
    result: Array<Object3D> = []
) => {
    for (const child of object.children) {
        //@ts-ignore
        child.material && child.visible && result.push(child)
        child.visible && getVisibleChildren(child, result)
    }
    return result
}

export default throttleFrame(getVisibleChildren)
