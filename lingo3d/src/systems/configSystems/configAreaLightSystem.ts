import AreaLight from "../../display/lights/AreaLight"
import { CM2M } from "../../globals"
import createInternalSystem from "../utils/createInternalSystem"

export const configAreaLightSystem = createInternalSystem("configAreaLightSystem", {
    effect: (self: AreaLight) => {
        const { $light } = self
        if (!$light) return

        $light.width = self.width * self.scaleX * CM2M
        $light.height = self.height * self.scaleY * CM2M
        $light.color.set(self.color ?? "#ffffff")
    }
})
