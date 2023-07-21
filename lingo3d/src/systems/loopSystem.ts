import Appendable from "../display/core/Appendable"
import { onRender } from "../events/onRender"
import createInternalSystem from "./utils/createInternalSystem"

export const loopSystem = createInternalSystem("loopSystem", {
    update: (self: Appendable) => self.onLoop!(),
    updateTicker: onRender
})
