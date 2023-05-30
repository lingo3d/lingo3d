import Appendable from "../display/core/Appendable"
import { dtPtr } from "../pointers/dtPtr"
import createSystem from "./utils/createSystem"

export const loopSystem = createSystem({
    update: (self: Appendable) => self.onLoop!(dtPtr[0]),
    ticker: "loop"
})
