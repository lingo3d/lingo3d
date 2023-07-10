import { Object3D, PropertyBinding } from "three"
import { getFoundManager } from "../display/core/utils/getFoundManager"
import Model from "../display/Model"
import FoundManager from "../display/core/FoundManager"
import { indexMeshChildrenNames } from "./indexMeshChildrenNames"
import computeOnce2WithData from "./utils/computeOnce2WithData"

export default computeOnce2WithData(
    (loadedObject: Object3D, name: string, data: { owner: Model }) => {
        const result: Array<FoundManager> = []
        if (!name) {
            for (const child of indexMeshChildrenNames(loadedObject).values())
                result.push(getFoundManager(child, data.owner))
            return result
        }
        const sanitized = PropertyBinding.sanitizeNodeName(name)
        for (const child of indexMeshChildrenNames(loadedObject).values())
            child.name.startsWith(sanitized) &&
                result.push(getFoundManager(child, data.owner))
        return result
    }
)
