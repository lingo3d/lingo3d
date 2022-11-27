import store, { createEffect } from "@lincode/reactivity"
import { SSAOEffect } from "postprocessing"
import { getCameraRendered } from "../../../states/useCameraRendered"
import { getSSAO } from "../../../states/useSSAO"
import { getSSAOIntensity } from "../../../states/useSSAOIntensity"
import { getNormalPass } from "./normalPass"

const [setSSAOEffect, getSSAOEffect] = store<SSAOEffect | undefined>(undefined)
export { getSSAOEffect }

createEffect(() => {
    const normalPass = getNormalPass()
    if (!getSSAO() || !normalPass) return

    const effect = new SSAOEffect(getCameraRendered(), normalPass.texture)
    setSSAOEffect(effect)

    const { uniforms } = effect.ssaoMaterial
    // uniforms.fade.value = 0
    // uniforms.bias.value = 0
    effect.radius = 0.05
    effect.samples = 32
    effect.uniforms.get("luminanceInfluence")!.value = 0
    effect.ssaoMaterial.distanceFalloff =
        effect.ssaoMaterial.distanceThreshold = 1
    effect.ssaoMaterial.proximityThreshold =
        effect.ssaoMaterial.proximityFalloff = 0.01

    const handle0 = getSSAOIntensity((val) => (uniforms.intensity.value = val))

    return () => {
        setSSAOEffect(undefined)
        effect.dispose()
        handle0.cancel()
    }
}, [getSSAO, getCameraRendered, getNormalPass])
