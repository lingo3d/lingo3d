import { event } from "@lincode/events"
import diffSceneGraph from "../throttle/diffSceneGraph"

type TransformControlsPhase = "start" | "end"
type TransformControlsMode = "translate" | "rotate" | "scale"
export type TransformControlsPayload = {
    phase: TransformControlsPhase
    mode: TransformControlsMode
}

export const [emitTransformControls, onTransformControls] =
    event<TransformControlsPhase>()

onTransformControls((phase) => phase === "end" && diffSceneGraph())
