import Appendable from "../../api/core/Appendable"
import getStaticProperties from "../../display/utils/getStaticProperties"

export const getIncludeKeys = (manager: Appendable) => [
    ...(getStaticProperties(manager).includeKeys ?? []),
    ...(manager.runtimeIncludeKeys ?? [])
]
