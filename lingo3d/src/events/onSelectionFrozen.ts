import { event } from "@lincode/events"
import Appendable from "../api/core/Appendable"

export const [emitSelectionFrozen, onSelectionFrozen] = event<Appendable>()