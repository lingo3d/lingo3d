import { event } from "@lincode/events"
import { debounce } from "@lincode/utils"
import PositionedItem from "../api/core/PositionedItem"
import { getCamera } from "../states/useCamera"

const [_emitSelectionTarget, onSelectionTarget] = event<{ target?: PositionedItem, rightClick?: boolean }>()
const emitSelectionTarget = debounce((target?: PositionedItem, rightClick?: boolean) => (
    _emitSelectionTarget({ target, rightClick })
), 0, "trailing")

export { emitSelectionTarget, onSelectionTarget }

getCamera(() => emitSelectionTarget())