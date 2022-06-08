import { event } from "@lincode/events"
import { debounce } from "@lincode/utils"
import Appendable from "../api/core/Appendable"
import { getCameraRendered } from "../states/useCameraRendered"

const [_emitSelectionTarget, onSelectionTarget] = event<{ target?: Appendable, rightClick?: boolean }>()
const emitSelectionTarget = debounce((target?: Appendable, rightClick?: boolean) => (
    _emitSelectionTarget({ target, rightClick })
), 0, "trailing")

export { emitSelectionTarget, onSelectionTarget }

getCameraRendered(() => emitSelectionTarget())