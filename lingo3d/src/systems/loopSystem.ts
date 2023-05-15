import Appendable from "../display/core/Appendable"
import { onLoop } from "../events/onLoop"
import { dtPtr } from "../pointers/dtPtr"
import renderSystem from "./utils/renderSystem"

export const [addLoopSystem, deleteLoopSystem] = renderSystem(
    (self: Appendable) => self.onLoop!(dtPtr[0]),
    onLoop
)
