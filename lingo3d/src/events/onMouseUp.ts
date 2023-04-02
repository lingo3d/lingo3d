import { event } from "@lincode/events"
import { LingoMouseEvent } from "../interface/IMouse"

export const [emitMouseUp, onMouseUp] = event<LingoMouseEvent>()
