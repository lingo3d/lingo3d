import SkyLight from "../display/lights/SkyLight"
import createInternalSystem from "./utils/createInternalSystem"

export const skyLightSystem = createInternalSystem("skyLightSystem", {
    update: (self: SkyLight) => {
        const csm = self.$csm
        if (csm) {
            csm.lightDirection
                .copy(self.position)
                .normalize()
                .multiplyScalar(-1)
            csm.update()
        }
        self.$backLight.position.copy(self.position).multiplyScalar(-1)
    }
})
