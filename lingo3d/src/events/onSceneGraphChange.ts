import { event } from "@lincode/events"
import { throttleTrailing } from "@lincode/utils"

const [_emitSceneGraphChange, onSceneGraphChange] = event()
export { onSceneGraphChange }

export const emitSceneGraphChange = throttleTrailing(_emitSceneGraphChange)
