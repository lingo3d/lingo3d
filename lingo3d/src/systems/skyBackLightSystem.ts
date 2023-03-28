import DirectionalLight from "../display/lights/DirectionalLight"
import SkyLight from "../display/lights/SkyLight"
import renderSystemWithData from "../utils/renderSystemWithData"

export const updateBackLight = (self: SkyLight, backLight: DirectionalLight) =>
    backLight.position.copy(self.position.clone().multiplyScalar(-1))

export const [addSkyBackLightSystem, deleteSkyBackLightSystem] =
    renderSystemWithData(
        (self: SkyLight, data: { backLight: DirectionalLight }) =>
            updateBackLight(self, data.backLight)
    )
