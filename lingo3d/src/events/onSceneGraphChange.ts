import { event } from "@lincode/events"
import { debounce } from "@lincode/utils"

const [_emitSceneGraphChange, onSceneGraphChange] = event()
export { onSceneGraphChange }

export const emitSceneGraphChange = debounce(_emitSceneGraphChange, 0, "trailing")