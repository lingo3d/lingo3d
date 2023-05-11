import getAllSelectionTargets from "../../memo/getAllSelectionTargets"
import { getMultipleSelection } from "../../states/useMultipleSelection"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"

export default () => {
    if (getTransformControlsDragging() || getMultipleSelection()) return
    for (const target of getAllSelectionTargets()) target.dispose()
}
