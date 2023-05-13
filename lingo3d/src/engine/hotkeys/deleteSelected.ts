import { getMultipleSelection } from "../../states/useMultipleSelection"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import getAllSelectionTargets from "../../throttle/getAllSelectionTargets"

export default () => {
    if (getTransformControlsDragging() || getMultipleSelection()) return
    for (const target of getAllSelectionTargets()) target.dispose()
}
