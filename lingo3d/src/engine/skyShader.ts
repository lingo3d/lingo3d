import { lazy } from "@lincode/utils"
import { getSkyShaderOptions } from "../states/useSkyShaderOptions"
import { Sky } from "three/examples/jsm/objects/Sky"
import scene from "./scene"
import { getSkyShader } from "../states/useSkyShader"
import { vector3 } from "../display/utils/reusables"

const lazySky = lazy(() => {
    const sky = new Sky()
    sky.scale.setScalar(450000)

    getSkyShaderOptions((effectController) => {
        const { uniforms } = sky.material
        uniforms["turbidity"].value = effectController.turbidity
        uniforms["rayleigh"].value = effectController.rayleigh
        uniforms["mieCoefficient"].value = effectController.mieCoefficient
        uniforms["mieDirectionalG"].value = effectController.mieDirectionalG

        const theta = Math.PI * (effectController.inclination - 0.5)
        const phi = 2 * Math.PI * (effectController.azimuth - 0.5)

        vector3.x = Math.cos(phi)
        vector3.y = Math.sin(phi) * Math.sin(theta)
        vector3.z = Math.sin(phi) * Math.cos(theta)

        uniforms["sunPosition"].value.copy(vector3)
    })

    return sky
})

let enabledOld = false

getSkyShader((enabled) => {
    if (enabledOld === enabled) return
    enabledOld = enabled

    if (enabled) scene.add(lazySky())
    else scene.remove(lazySky())
})
