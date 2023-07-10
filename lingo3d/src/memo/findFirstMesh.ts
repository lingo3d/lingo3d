import { PropertyBinding } from "three"
import computeOnce2 from "./utils/computeOnce2"
import { getFoundManager } from "../display/core/utils/getFoundManager"
import Model from "../display/Model"
import { indexMeshChildrenNames } from "./indexMeshChildrenNames"

export default computeOnce2((self: Model, name: string) => {
    if (!name) {
        const [first] = indexMeshChildrenNames(self.$loadedObject!).values()
        return getFoundManager(first, self)
    }
    const sanitized = PropertyBinding.sanitizeNodeName(name)
    for (const child of indexMeshChildrenNames(self.$loadedObject!).values())
        if (child.name.startsWith(sanitized))
            return getFoundManager(child, self)
})
