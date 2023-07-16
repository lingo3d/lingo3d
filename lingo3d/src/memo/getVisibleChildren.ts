import { Mesh, Object3D } from "three"
import computePerFrame from "./utils/computePerFrame"

export default computePerFrame((object: Object3D) => {
    const result: Array<Object3D> = []
    object.traverse(
        (child: Object3D | Mesh) =>
            "material" in child &&
            child.material &&
            child.visible &&
            result.push(child)
    )
    return result
})
