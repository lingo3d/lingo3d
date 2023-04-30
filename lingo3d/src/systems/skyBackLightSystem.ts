import DirectionalLight from "../display/lights/DirectionalLight"
import SkyLight from "../display/lights/SkyLight"
import renderSystemWithData from "./utils/renderSystemWithData"

export const [addSkyBackLightSystem, deleteSkyBackLightSystem] =
    renderSystemWithData(
        (self: SkyLight, data: { backLight: DirectionalLight }) =>
            data.backLight.position.copy(
                self.position.clone().multiplyScalar(-1)
            )
    )
