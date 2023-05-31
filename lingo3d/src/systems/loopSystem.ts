import Appendable from "../display/core/Appendable"
import { dtPtr } from "../pointers/dtPtr"
import createInternalSystem from "./utils/createInternalSystem"

export const loopSystem = createInternalSystem("loopSystem", {
    update: (self: Appendable) => self.onLoop!(dtPtr[0]),
    ticker: "loop"
})
