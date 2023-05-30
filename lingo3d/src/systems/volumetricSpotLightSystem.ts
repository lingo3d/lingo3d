import { deg2Rad } from "@lincode/math"
import { Mesh } from "three"
import SpotLight from "../display/lights/SpotLight"
import getWorldPosition from "../memo/getWorldPosition"
import { CM2M } from "../globals"
import createSystem from "./utils/createSystem"

export const volumetricSpotLightSystem = createSystem({
    data: {} as { light: SpotLight; material: any },
    update: (cone: Mesh, { light, material }) => {
        cone.scale.y = light.distance * CM2M * light.volumetricDistance
        cone.position.y = -cone.scale.y * 0.5
        cone.scale.x = cone.scale.z =
            2 * Math.tan(light.angle * deg2Rad) * cone.scale.y
        material.attenuation = cone.scale.y
        material.spotPosition.copy(getWorldPosition(light.outerObject3d))
    }
})
