import { Object3D } from "three"
import computeOnce from "./utils/computeOnce"
import { indexChildrenNames } from "./indexChildrenNames"

export const indexMeshChildrenNames = computeOnce((parent: Object3D) => {
    const result = new Map<string, Object3D>()
    for (const [name, child] of indexChildrenNames(parent))
        "material" in child && result.set(name, child)
    return result
})
