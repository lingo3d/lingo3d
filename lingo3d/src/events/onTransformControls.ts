import { event } from "@lincode/events"

export const [emitTransformControls, onTransformControls] = event<
    "start" | "end" | "move"
>()
