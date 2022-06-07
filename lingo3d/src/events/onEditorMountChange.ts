import { event } from "@lincode/events"
import { debounce } from "@lincode/utils"

const [_emitEditorMountChange, onEditorMountChange] = event()
export { onEditorMountChange }

export const emitEditorMountChange = debounce(_emitEditorMountChange, 0, "trailing")