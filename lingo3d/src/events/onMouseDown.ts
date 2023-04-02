import { event } from "@lincode/events"
import { LingoMouseEvent } from "../interface/IMouse"

export const [emitMouseDown, onMouseDown] = event<LingoMouseEvent>()
