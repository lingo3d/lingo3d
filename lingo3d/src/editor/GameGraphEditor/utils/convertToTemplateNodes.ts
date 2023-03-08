import { assert } from "@lincode/utils"
import Appendable from "../../../api/core/Appendable"
import { getGameGraph } from "../../../states/useGameGraph"
import Connector, {
    connectedMap,
    managerConnectorsMap
} from "../../../visualScripting/Connector"
import TemplateNode from "../../../visualScripting/TemplateNode"
import createConnector from "./createConnector"

const findConnected = (manager: Appendable, result = new Set<Appendable>()) => {
    for (const connectedManager of connectedMap.get(manager) ?? []) {
        if (result.has(connectedManager)) continue
        result.add(connectedManager)
        findConnected(connectedManager, result)
    }
    return result
}

export default (manager: Appendable) => {
    const gameGraph = getGameGraph()!
    const managerNode = gameGraph.data[manager.uuid]
    assert(managerNode.type === "node")

    const sourceUUIDTemplateMap = new Map<string, TemplateNode>()
    const connectors = new Set<Connector>()

    let managerTemplate: TemplateNode
    for (const connected of findConnected(manager)) {
        const connectedNode = gameGraph.data[connected.uuid]
        assert(connectedNode.type === "node")

        for (const connector of managerConnectorsMap.get(connected) ?? [])
            connectors.add(connector)

        const template = new TemplateNode(connected)
        gameGraph.append(template)
        gameGraph.mergeData({
            [template.uuid]: {
                type: "node",
                x: connectedNode.x,
                y: connectedNode.y
            }
        })
        sourceUUIDTemplateMap.set(connected.uuid, template)
        if (connected === manager) managerTemplate = template
    }

    for (const { from, to, fromProp, toProp, xyz } of connectors)
        createConnector(
            sourceUUIDTemplateMap.get(from!)!,
            fromProp!,
            sourceUUIDTemplateMap.get(to!)!,
            toProp!,
            xyz
        )
    return managerTemplate!
}
