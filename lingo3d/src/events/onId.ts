import { event } from "@lincode/events"
import Appendable from "../api/core/Appendable"

export const [emitId, onId] = event<Appendable>()
