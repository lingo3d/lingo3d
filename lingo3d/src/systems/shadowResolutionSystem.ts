import PointLight from "../display/lights/PointLight"
import SpotLight from "../display/lights/SpotLight"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import renderSystem from "./utils/renderSystem"

export const [addShadowResolutionSystem, deleteShadowResolutionSystem] =
    renderSystem((self: PointLight | SpotLight) => {
        const camera = cameraRenderedPtr[0]
        const distance = self.position.distanceTo(camera.position)
        console.log(distance)
    })
