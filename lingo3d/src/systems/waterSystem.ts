import { dtPtr } from "../pointers/dtPtr"
import Water from "../display/Water"
import createSystem from "./utils/createSystem"

export const waterSystem = createSystem({
    update: (self: Water) =>
        (self.$water!.material.uniforms["time"].value += dtPtr[0] * self.speed)
})
