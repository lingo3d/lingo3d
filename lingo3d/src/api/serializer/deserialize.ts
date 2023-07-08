import { omit } from "@lincode/utils"
import createObject from "./createObject"
import { SceneGraphNode } from "./types"
import nonSerializedProperties from "./nonSerializedProperties"
import Appendable from "../../display/core/Appendable"
import type Model from "../../display/Model"
import { configFindNodeSystem } from "../../systems/configLoadedSystems/configFindSystem"
import { nodeToObjectManagerPtr } from "../../pointers/nodeToObjectManagerPtr"

const nodeToObjectManager = (
    node: SceneGraphNode,
    parent: Appendable | undefined
) => {
    if (node.type === "lingo3d") return
    if (node.type === "find") {
        configFindNodeSystem.add(node, { owner: parent as Model })
        return
    }
    const object = createObject(node.type)
    Object.assign(object, omit(node, nonSerializedProperties))
    node.children
        ?.map((n) => nodeToObjectManager(n, object))
        .forEach((c) => c && object.append(c as any))
    return object
}
export type NodeToObjectManager = typeof nodeToObjectManager
nodeToObjectManagerPtr[0] = nodeToObjectManager

export default (graph: Array<SceneGraphNode>) =>
    graph.map((n) => nodeToObjectManager(n, undefined))
