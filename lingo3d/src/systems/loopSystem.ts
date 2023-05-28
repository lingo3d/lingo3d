import Appendable from "../display/core/Appendable"
import { dtPtr } from "../pointers/dtPtr"
import gameSystem from "./utils/gameSystem"

export const loopSystem = gameSystem({
    update: (self: Appendable) => self.onLoop!(dtPtr[0]),
    ticker: "loop"
})
