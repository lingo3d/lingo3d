import { omit } from "@lincode/utils"
import createObject from "./createObject"
import { SceneGraphNode } from "./types"
import Loaded from "../../display/core/Loaded"
import { Object3D } from "three"
import Reresolvable from "../../display/core/utils/Reresolvable"
import nonSerializedProperties from "./nonSerializedProperties"

const nodeToObjectManager = (
    node: SceneGraphNode,
    loadedResolvables: Array<Reresolvable<Object3D>> | undefined
) => {
    if (node.type === "lingo3d") return

    const object = createObject(node.type)
    loadedResolvables &&
        object instanceof Loaded &&
        loadedResolvables.push(object.loaded)
    Object.assign(object, omit(node, nonSerializedProperties))
    node.children
        ?.map((n) => nodeToObjectManager(n, loadedResolvables))
        .forEach((c) => c && object.append(c))
    return object
}

export default (
    graph: Array<SceneGraphNode>,
    loadedResolvables?: Array<Reresolvable<Object3D>>
) => graph.map((n) => nodeToObjectManager(n, loadedResolvables))
