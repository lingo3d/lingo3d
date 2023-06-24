import Appendable from "../display/core/Appendable"
import createInternalSystem from "./utils/createInternalSystem"

export const loopSystem = createInternalSystem("loopSystem", {
    update: (self: Appendable) => self.onLoop!(),
    updateTicker: "render"
})
