import { CSM } from "three/examples/jsm/csm/CSM"
import SkyLight from "../display/lights/SkyLight"
import renderSystemWithData from "./utils/renderSystemWithData"

export const [addSkyLightSystem, deleteSkyLightSystem] = renderSystemWithData(
    (csm: CSM, { self }: { self: SkyLight }) => {
        csm.lightDirection.copy(
            self.position.clone().normalize().multiplyScalar(-1)
        )
        csm.update()
    }
)
