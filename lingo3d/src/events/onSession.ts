import { event } from "@lincode/events"
import { getSessionToken } from "../states/useSessionToken"

const [emitSession, onSession] = event()
export { onSession }

getSessionToken(() => emitSession())
