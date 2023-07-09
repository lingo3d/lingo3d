import { Mesh } from "three"
import SpotLight from "../display/lights/SpotLight"
import getWorldPosition from "../memo/getWorldPosition"
import { CM2M } from "../globals"
import createInternalSystem from "./utils/createInternalSystem"
import { DEG2RAD } from "three/src/math/MathUtils"

export const volumetricSpotLightSystem = createInternalSystem(
    "volumetricSpotLightSystem",
    {
        data: {} as { light: SpotLight; material: any },
        update: (cone: Mesh, { light, material }) => {
            cone.scale.y = light.distance * CM2M * light.volumetricDistance
            cone.position.y = -cone.scale.y * 0.5
            cone.scale.x = cone.scale.z =
                2 * Math.tan(light.angle * DEG2RAD) * cone.scale.y
            material.attenuation = cone.scale.y
            material.spotPosition.copy(getWorldPosition(light.$object))
        }
    }
)
