import { event } from "@lincode/events"
import Appendable from "../api/core/Appendable"

export const [emitDispose, onDispose] = event<Appendable>()
