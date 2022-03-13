import { event } from "@lincode/events"

export const [emitTransformControls, onTransformControls] = event<"start" | "stop" | "move">()