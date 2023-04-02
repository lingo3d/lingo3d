import { event } from "@lincode/events"
import { LingoMouseEvent } from "../interface/IMouse"

export const [emitMouseClick, onMouseClick] = event<LingoMouseEvent>()
