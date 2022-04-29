import { event } from "@lincode/events"
import { debounce } from "@lincode/utils"
import SimpleObjectManager from "../display/core/SimpleObjectManager"

const [_emitSelectionTarget, onSelectionTarget] = event<SimpleObjectManager | undefined>()
const emitSelectionTarget = debounce(_emitSelectionTarget, 0, "trailing")

export { emitSelectionTarget, onSelectionTarget }