import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"
import Model from "../../display/Model"
import { FindNode } from "../../api/serializer/types"
import { omit } from "@lincode/utils"
import nonSerializedProperties from "../../api/serializer/nonSerializedProperties"
import { nodeToObjectManagerPtr } from "../../pointers/nodeToObjectManagerPtr"

export const configFindNodeSystem = createLoadedEffectSystem(
    "configFindNodeSystem",
    {
        data: {} as { owner: Model },
        effect: (node: FindNode, data) => {
            const object = data.owner.find(node.name)!
            object.$unghost()
            Object.assign(object, omit(node, nonSerializedProperties))
            node.children
                ?.map((n) => nodeToObjectManagerPtr[0](n, object))
                .forEach((c) => c && object.append(c))
        },
        loading: (_, data) => {
            return (
                "$loadedObject3d" in data.owner && !data.owner.$loadedObject3d
            )
        }
    }
)
