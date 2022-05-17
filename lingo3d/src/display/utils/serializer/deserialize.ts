import { omit } from "@lincode/utils"
import createObject from "./createObject"
import { nonSerializedProperties, SceneGraphNode } from "./types"
import applySetup from "./applySetup"
import { Resolvable } from "@lincode/promiselikes"

const nodeToObjectManager = (node: SceneGraphNode, loadedResolvables: Array<Resolvable> | undefined) => {
    if (node.type === "setup") {
        applySetup(node)
        return
    }
    if (node.type === "animation") return

    const object = createObject(node.type)
    //@ts-ignore
    loadedResolvables && "loadedResolvable" in object && loadedResolvables.push(object.loadedResolvable)
    Object.assign(object, omit(node, nonSerializedProperties))
    node.children?.map(n => nodeToObjectManager(n, loadedResolvables)).forEach(c => c && object.append(c))
    return object
}

export default (graph: Array<SceneGraphNode>, loadedResolvables?: Array<Resolvable>) => (
    graph.map(n => nodeToObjectManager(n, loadedResolvables))
)