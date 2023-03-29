import { dtPtr } from "../engine/eventLoop"
import { onLoop } from "../events/onLoop"
import renderSystem from "./utils/renderSystem"

export const [addLoopSystem, deleteLoopSystem] = renderSystem(
    (cb: (dt: number) => void) => cb(dtPtr[0]),
    onLoop
)
