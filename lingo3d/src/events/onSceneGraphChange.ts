import { event } from "@lincode/events"
import Appendable from "../api/core/Appendable"
import throttleFrameTrailing from "../throttle/utils/throttleFrameTrailing"

const [_emitSceneGraphChange, onSceneGraphChange] = event<Appendable>()
export { onSceneGraphChange }

export const emitSceneGraphChange = throttleFrameTrailing(_emitSceneGraphChange)
