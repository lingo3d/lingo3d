import SkyLight from "../display/lights/SkyLight"
import gameSystem from "./utils/gameSystem"

export const skyLightSystem = gameSystem({
    update: (self: SkyLight) => {
        const csm = self.$csm
        if (csm) {
            csm.lightDirection.copy(
                self.position.clone().normalize().multiplyScalar(-1)
            )
            csm.update()
        }
        self.$backLight.position.copy(self.position.clone().multiplyScalar(-1))
    }
})
