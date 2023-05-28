import { dtPtr } from "../pointers/dtPtr"
import Water from "../display/Water"
import gameSystem from "./utils/gameSystem"

export const waterSystem = gameSystem({
    update: (self: Water) =>
        (self.$water!.material.uniforms["time"].value += dtPtr[0] * self.speed)
})
