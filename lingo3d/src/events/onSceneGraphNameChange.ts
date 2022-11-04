import { event } from "@lincode/events"
import { debounceTrailing } from "@lincode/utils"

const [_emitSceneGraphNameChange, onSceneGraphNameChange] = event()
export { onSceneGraphNameChange }

export const emitSceneGraphNameChange = debounceTrailing(
    _emitSceneGraphNameChange
)
