import { event } from "@lincode/events"
import SimpleObjectManager from "../display/core/SimpleObjectManager"

export const [emitEditorCenterView, onEditorCenterView] = event<SimpleObjectManager>()