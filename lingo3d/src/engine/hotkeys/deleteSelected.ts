import { getMultipleSelection } from "../../states/useMultipleSelection"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import Connector from "../../visualScripting/Connector"

export default () => {
    if (getTransformControlsDragging() || getMultipleSelection()) return

    const selectionTarget = getSelectionTarget()
    const [multipleSelectionTargets] = getMultipleSelectionTargets()

    if (selectionTarget instanceof Connector) {
        console.log("here")
    }

    selectionTarget?.dispose()
    for (const target of multipleSelectionTargets) target.dispose()
}
