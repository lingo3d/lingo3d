import Appendable from "../../../api/core/Appendable"
import { getGameGraph } from "../../../states/useGameGraph"
import {
    connectedMap,
    managerConnectorsMap
} from "../../../visualScripting/Connector"
import TemplateNode from "../../../visualScripting/TemplateNode"

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
    if (managerNode.type !== "node") return

    for (const connected of findConnected(manager)) {
        const connectedNode = gameGraph.data[connected.uuid]
        if (connectedNode.type !== "node") continue

        console.log(managerConnectorsMap.get(connected))

        const template = new TemplateNode(connected)
        gameGraph.append(template)
        gameGraph.mergeData({
            [template.uuid]: {
                type: "node",
                x: connectedNode.x,
                y: connectedNode.y
            }
        })
    }
}
