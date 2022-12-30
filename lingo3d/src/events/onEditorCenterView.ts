import { event } from "@lincode/events"
import PositionedManager from "../api/core/PositionedManager"

export const [emitEditorCenterView, onEditorCenterView] =
    event<PositionedManager>()
