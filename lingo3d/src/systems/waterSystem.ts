import { dtPtr } from "../pointers/dtPtr"
import Water from "../display/Water"
import createSystem from "./utils/createInternalSystem"

export const waterSystem = createSystem("waterSystem", {
    update: (self: Water) =>
        (self.$water!.material.uniforms["time"].value += dtPtr[0] * self.speed)
})
