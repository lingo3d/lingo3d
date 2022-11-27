import { event } from "@lincode/events"
import Appendable from "../api/core/Appendable"

export const [emitName, onName] = event<Appendable>()
