import { event } from "@lincode/events"
import { getWorldPlayComputed } from "../states/useWorldPlayComputed"

const [_emitLoop, onLoop] = event()
export { onLoop }

let worldPlay = true
getWorldPlayComputed((val) => (worldPlay = val))

export const emitLoop = () => worldPlay && _emitLoop()
