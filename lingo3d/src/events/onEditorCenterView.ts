import { event } from "@lincode/events"
import MeshAppendable from "../api/core/MeshAppendable"

export const [emitEditorCenterView, onEditorCenterView] =
    event<MeshAppendable>()
