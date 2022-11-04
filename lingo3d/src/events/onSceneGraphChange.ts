import { event } from "@lincode/events"
import { debounceTrailing } from "@lincode/utils"

const [_emitSceneGraphChange, onSceneGraphChange] = event()
export { onSceneGraphChange }

export const emitSceneGraphChange = debounceTrailing(_emitSceneGraphChange)
