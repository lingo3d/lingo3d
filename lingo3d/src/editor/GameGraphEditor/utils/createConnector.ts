import Appendable from "../../../display/core/Appendable"
import { getGameGraph } from "../../../states/useGameGraph"
import Connector from "../../../visualScripting/Connector"

export default (
    fromManager: Appendable,
    fromProp: string,
    toManager: Appendable,
    toProp: string,
    xyz?: string
) => {
    const connector = Object.assign(new Connector(), {
        from: fromManager.uuid,
        fromProp,
        to: toManager.uuid,
        toProp,
        xyz
    })
    const gameGraph = getGameGraph()!
    gameGraph.append(connector)
    gameGraph.mergeData({
        [connector.uuid]: {
            type: "connector",
            from: fromManager.uuid,
            to: toManager.uuid
        }
    })
}
