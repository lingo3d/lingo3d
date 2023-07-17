import { event } from "@lincode/events"
import { WorldMode } from "../states/useWorldMode"

export const [emitWorldMode, onWorldMode] = event<WorldMode>()
