import { assert } from "@lincode/utils"
import Appendable from "../../../display/core/Appendable"
import { getGameGraph } from "../../../states/useGameGraph"
import Connector, { findConnected } from "../../../visualScripting/Connector"
import SpawnNode from "../../../visualScripting/SpawnNode"
import TemplateNode from "../../../visualScripting/TemplateNode"
import createConnector from "./createConnector"
import { managerConnectorsMap } from "../../../collections/managerConnectorsMap"

export default (manager: Appendable, spawnNode: SpawnNode) => {
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

        const template = new TemplateNode()
        template.source = connected
        template.spawnNode = spawnNode.uuid
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
