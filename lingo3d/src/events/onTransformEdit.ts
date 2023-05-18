import { event } from "@lincode/events"
import MeshAppendable from "../display/core/MeshAppendable"
import { TransformControlsMode } from "./onTransformControls"

export const [emitTransformEdit, onTransformEdit] = event<{
    target: MeshAppendable
    phase: "start" | "end"
    mode: TransformControlsMode
}>()
