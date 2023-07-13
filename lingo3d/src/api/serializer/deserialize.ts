import { omit } from "@lincode/utils"
import createObject from "./createObject"
import { SceneGraphNode } from "./types"
import nonSerializedProperties from "./nonSerializedProperties"
import Appendable from "../../display/core/Appendable"
import type Model from "../../display/Model"

const nodeToObjectManager = (
    node: SceneGraphNode,
    parent: Appendable | undefined
) => {
    if (node.type === "lingo3d") return
    if (node.type === "find") {
        parent!.$events.once("loaded", () => {
            const object = (parent as Model).find(node.name)!
            object.$disableSerialize = false
            Object.assign(object, omit(node, nonSerializedProperties))
            node.children
                ?.map((n) => nodeToObjectManager(n, object))
                .forEach((c) => c && object.append(c))
        })
        return
    }
    if (node.type === "characterRigJoint") {
        //mark
        console.log(parent)
        return
    }
    const object = createObject(node.type)
    Object.assign(object, omit(node, nonSerializedProperties))
    node.children
        ?.map((n) => nodeToObjectManager(n, object))
        .forEach((c) => c && object.append(c as any))
    return object
}

export default (graph: Array<SceneGraphNode>) =>
    graph.map((n) => nodeToObjectManager(n, undefined))
