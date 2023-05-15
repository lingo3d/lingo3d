import Appendable from "../../display/core/Appendable"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"

export default (to: Appendable) => {
    const [target] = selectionTargetPtr
    if (!target) return
    to.attach(target)
}
