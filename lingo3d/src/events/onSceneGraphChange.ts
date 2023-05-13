import { event } from "@lincode/events"
import throttleFrameTrailing from "../throttle/utils/throttleFrameTrailing"

const [_emitSceneGraphChange, onSceneGraphChange] = event()
export { onSceneGraphChange }

export const emitSceneGraphChange = throttleFrameTrailing(_emitSceneGraphChange)
