import SkyLight from "../display/lights/SkyLight"
import renderSystem from "./utils/renderSystem"

export const [addSkyLightSystem] = renderSystem((self: SkyLight) => {
    const csm = self.$csm
    if (csm) {
        csm.lightDirection.copy(
            self.position.clone().normalize().multiplyScalar(-1)
        )
        csm.update()
    }
    self.$backLight.position.copy(self.position.clone().multiplyScalar(-1))
})
