import { uuidMap } from "../../api/core/collections"
import { getMultipleSelection } from "../../states/useMultipleSelection"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import Connector from "../../visualScripting/Connector"
import GameGraph from "../../visualScripting/GameGraph"
import SpawnNode from "../../visualScripting/SpawnNode"

export default () => {
    if (getTransformControlsDragging() || getMultipleSelection()) return

    const selectionTarget = getSelectionTarget()
    const [multipleSelectionTargets] = getMultipleSelectionTargets()

    if (
        selectionTarget instanceof Connector &&
        selectionTarget.from &&
        selectionTarget.to
    ) {
        const fromManager = uuidMap.get(selectionTarget.from)
        const toManager = uuidMap.get(selectionTarget.to)
        if (fromManager instanceof SpawnNode && toManager) {
            const gameGraph = toManager.parent
            if (gameGraph instanceof GameGraph) {
                //mark
            }
            return
        }
    }

    selectionTarget?.dispose()
    for (const target of multipleSelectionTargets) target.dispose()
}
