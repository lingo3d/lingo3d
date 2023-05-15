import Appendable from "../../display/core/Appendable"
import { runtimeIncludeKeysMap } from "../../collections/runtimeCollections"
import getStaticProperties from "../../display/utils/getStaticProperties"

export const getIncludeKeys = (manager: Appendable) => [
    ...(getStaticProperties(manager).includeKeys ?? []),
    ...(runtimeIncludeKeysMap.get(manager) ?? [])
]
