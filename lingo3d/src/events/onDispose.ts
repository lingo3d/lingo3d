import { event } from "@lincode/events"
import Appendable from "../display/core/Appendable"

export const [emitDispose, onDispose] = event<Appendable>()
