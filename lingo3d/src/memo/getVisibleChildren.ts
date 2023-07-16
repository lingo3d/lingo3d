import { Object3D } from "three"
import computePerFrame from "./utils/computePerFrame"

const getVisibleChildren = (object: Object3D, result: Array<Object3D> = []) => {
    for (const child of object.children) {
        //@ts-ignore
        child.material && child.visible && result.push(child)
        child.visible && getVisibleChildren(child, result)
    }
    return result
}

export default computePerFrame(getVisibleChildren)
