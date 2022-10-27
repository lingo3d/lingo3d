import { event } from "@lincode/events"
import { debounce } from "@lincode/utils"

const [_emitSceneGraphNameChange, onSceneGraphNameChange] = event()
export { onSceneGraphNameChange }

export const emitSceneGraphNameChange = debounce(
    _emitSceneGraphNameChange,
    0,
    "trailing"
)
