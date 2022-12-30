import { event } from "@lincode/events"
import PositionedManager from "../display/core/PositionedManager"

export const [emitEditorCenterView, onEditorCenterView] =
    event<PositionedManager>()
