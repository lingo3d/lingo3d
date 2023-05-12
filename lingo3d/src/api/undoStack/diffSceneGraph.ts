import { throttleTrailing } from "@lincode/utils"
import { SceneGraphNode } from "../serializer/types"

type GroupedNodes = Record<string, Array<SceneGraphNode>>
let prevNodes: GroupedNodes = {}

export default throttleTrailing((_: void) => {
    //@ts-ignore
    const nodes: GroupedNodes = serialize().group((node) => node.uuid)

    const createNodes: Array<SceneGraphNode> = []
    const updateNodes: Array<SceneGraphNode> = []
    const deleteNodes: Array<SceneGraphNode> = []

    for (const [uuid, [node]] of Object.entries(nodes)) {
        if (!(uuid in prevNodes)) {
            createNodes.push(node)
            continue
        }
        const prevNode: any = prevNodes[uuid][0]
        const diffNode: any = { uuid }
        let hasDiff = false
        for (const [key, value] of Object.entries(node))
            if (value !== prevNode[key]) {
                diffNode[key] = value
                hasDiff = true
            }
        hasDiff && updateNodes.push(diffNode)
    }
    for (const [uuid, [node]] of Object.entries(prevNodes)) {
        if (uuid in nodes) continue
        deleteNodes.push(node)
    }

    console.log("create", createNodes)
    console.log("update", updateNodes)
    console.log("delete", deleteNodes)

    prevNodes = nodes
})
