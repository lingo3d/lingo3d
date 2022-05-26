import { event } from "@lincode/events"
import { debounce } from "@lincode/utils"
import EventLoopItem from "../api/core/EventLoopItem"
import { getCamera } from "../states/useCamera"

const [_emitSelectionTarget, onSelectionTarget] = event<{ target?: EventLoopItem, rightClick?: boolean }>()
const emitSelectionTarget = debounce((target?: EventLoopItem, rightClick?: boolean) => (
    _emitSelectionTarget({ target, rightClick })
), 0, "trailing")

export { emitSelectionTarget, onSelectionTarget }

getCamera(() => emitSelectionTarget())