import { event } from "@lincode/events"
import { LingoMouseEvent } from "../interface/IMouse"

export const [emitMouseMove, onMouseMove] = event<LingoMouseEvent>()
