import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"
import Model from "../../display/Model"
import { FindNode } from "../../api/serializer/types"
import { omit } from "@lincode/utils"
import { nodeToObjectManager } from "../../api/serializer/deserialize"
import nonSerializedProperties from "../../api/serializer/nonSerializedProperties"

export const configFindNodeSystem = createLoadedEffectSystem(
    "configFindNodeSystem",
    {
        data: {} as { owner: Model },
        effect: (node: FindNode, data) => {
            const object = data.owner.find(node.name)!
            object.$unghost()
            Object.assign(object, omit(node, nonSerializedProperties))
            node.children
                ?.map((n) => nodeToObjectManager(n, object))
                .forEach((c) => c && object.append(c))
        },
        cleanup: (self, data) => {},
        loading: (self, data) => {
            return (
                "$loadedObject3d" in data.owner && !data.owner.$loadedObject3d
            )
        }
    }
)
