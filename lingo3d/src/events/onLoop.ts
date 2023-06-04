import { event } from "@lincode/events"
import { worldPlayPtr } from "../pointers/worldPlayPtr"

const [_emitLoop, onLoop] = event()
export { onLoop }

export const emitLoop = () => worldPlayPtr[0] === "live" && _emitLoop()
