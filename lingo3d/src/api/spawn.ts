import { forceGet } from "@lincode/utils"
import Appendable from "./core/Appendable"
import deserialize from "./serializer/deserialize"
import serialize from "./serializer/serialize"
import { SceneGraphNode } from "./serializer/types"

const managerSerializedMap = new WeakMap<Appendable, Array<SceneGraphNode>>()

export default (manager: Appendable) =>
    deserialize(
        forceGet(managerSerializedMap, manager, () =>
            serialize(false, manager, true)
        )
    )[0]
