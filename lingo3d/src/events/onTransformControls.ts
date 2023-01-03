import { event } from "@lincode/events"

export type TransformControlsPhase = "start" | "end" | "move"

export const [emitTransformControls, onTransformControls] =
    event<TransformControlsPhase>()
