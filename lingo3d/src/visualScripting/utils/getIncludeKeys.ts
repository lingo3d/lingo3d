import Appendable from "../../api/core/Appendable"
import unsafeGetValue from "../../utils/unsafeGetValue"

export const getIncludeKeys = (manager: Appendable) => [
    ...(unsafeGetValue(manager.constructor, "includeKeys") ?? []),
    ...(unsafeGetValue(manager, "runtimeIncludeKeys") ?? [])
]
