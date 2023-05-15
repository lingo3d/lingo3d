import { event } from "@lincode/events"
import MeshAppendable from "../display/core/MeshAppendable"

export const [emitEditorCenterView, onEditorCenterView] =
    event<MeshAppendable>()
