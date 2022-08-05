import { event } from "@lincode/events"
import PositionedItem from "../api/core/PositionedItem"

export const [emitEditorCenterView, onEditorCenterView] =
    event<PositionedItem>()
