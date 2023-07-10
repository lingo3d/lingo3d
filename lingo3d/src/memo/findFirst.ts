import { PropertyBinding } from "three"
import computeOnce2 from "./utils/computeOnce2"
import { getFoundManager } from "../display/core/utils/getFoundManager"
import Model from "../display/Model"
import { indexChildrenNames } from "./indexChildrenNames"

export default computeOnce2((self: Model, name: string) => {
    if (!name) {
        const [first] = indexChildrenNames(self.$loadedObject!).values()
        return getFoundManager(first, self)
    }
    const sanitized = PropertyBinding.sanitizeNodeName(name)
    for (const child of indexChildrenNames(self.$loadedObject!).values())
        if (child.name.startsWith(sanitized))
            return getFoundManager(child, self)
})
