import { event } from "@lincode/events"
import SimpleObjectManager from "../display/core/SimpleObjectManager"

export const [emitSelectionTarget, onSelectionTarget] = event<SimpleObjectManager | undefined>()