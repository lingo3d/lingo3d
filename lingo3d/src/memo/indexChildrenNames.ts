import { Object3D } from "three"
import computeOnce from "./utils/computeOnce"

export const indexChildrenNames = computeOnce((parent: Object3D) => {
    const result = new Map<string, Object3D>()
    parent.traverse(
        (child) => !result.has(child.name) && result.set(child.name, child)
    )
    return result
})
