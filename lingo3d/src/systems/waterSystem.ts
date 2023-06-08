import Water from "../display/Water"
import createInternalSystem from "./utils/createInternalSystem"
import { dtNormPtr } from "../pointers/dtNormPtr"

export const waterSystem = createInternalSystem("waterSystem", {
    update: (self: Water) =>
        (self.$water!.material.uniforms["time"].value +=
            dtNormPtr[0] * self.speed)
})
