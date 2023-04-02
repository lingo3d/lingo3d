import { event } from "@lincode/events"
import { LingoMouseEvent } from "../interface/IMouse"

export const [emitMouseRightClick, onMouseRightClick] = event<LingoMouseEvent>()
