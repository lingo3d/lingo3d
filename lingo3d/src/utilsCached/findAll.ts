import { PropertyBinding } from "three"
import computeOnce2 from "./utils/computeOnce2"
import { getFoundManager } from "../api/utils/getFoundManager"
import Model from "../display/Model"
import { indexChildrenNames } from "./indexChildrenNames"
import FoundManager from "../display/core/FoundManager"

export default computeOnce2((self: Model, name: string) => {
    const result: Array<FoundManager> = []
    if (!name) {
        for (const child of indexChildrenNames(self.loadedObject3d!).values())
            result.push(getFoundManager(child, self))
        return result
    }
    const sanitized = PropertyBinding.sanitizeNodeName(name)
    for (const child of indexChildrenNames(self.loadedObject3d!).values())
        child.name.startsWith(sanitized) &&
            result.push(getFoundManager(child, self))
    return result
})
