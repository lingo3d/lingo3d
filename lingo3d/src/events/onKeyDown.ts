import { event } from "@lincode/events"

export const [emitKeyDown, onKeyDown] = event<string>()
