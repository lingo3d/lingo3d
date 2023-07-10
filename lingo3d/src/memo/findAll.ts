import { Object3D, PropertyBinding } from "three"
import { getFoundManager } from "../display/core/utils/getFoundManager"
import { indexChildrenNames } from "./indexChildrenNames"
import FoundManager from "../display/core/FoundManager"
import computeOnce2WithData from "./utils/computeOnce2WithData"
import Model from "../display/Model"

export default computeOnce2WithData(
    (loadedObject: Object3D, name: string, data: { owner: Model }) => {
        const result: Array<FoundManager> = []
        if (!name) {
            for (const child of indexChildrenNames(loadedObject).values())
                result.push(getFoundManager(child, data.owner))
            return result
        }
        const sanitized = PropertyBinding.sanitizeNodeName(name)
        for (const child of indexChildrenNames(loadedObject).values())
            child.name.startsWith(sanitized) &&
                result.push(getFoundManager(child, data.owner))
        return result
    }
)
