import { event } from "@lincode/events"
import { debounce } from "@lincode/utils"

const [_emitSceneChange, onSceneChange] = event()
export { onSceneChange }

export const emitSceneChange = debounce(_emitSceneChange, 0, "trailing")