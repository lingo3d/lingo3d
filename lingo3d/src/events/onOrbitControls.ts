import { event } from "@lincode/events"

export const [emitOrbitControls, onOrbitControls] = event<"start" | "stop" | "move">()