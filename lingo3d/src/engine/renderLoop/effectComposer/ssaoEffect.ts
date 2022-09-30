import store, { createEffect } from "@lincode/reactivity"
import { SSAOEffect } from "postprocessing"
import { getCameraRendered } from "../../../states/useCameraRendered"
import { getSSAO } from "../../../states/useSSAO"
import { getNormalPass } from "./normalPass"

const [setSSAOEffect, getSSAOEffect] = store<SSAOEffect | undefined>(undefined)
export { getSSAOEffect }

createEffect(() => {
    const normalPass = getNormalPass()
    if (!getSSAO() || !normalPass) return

    const camera = getCameraRendered()
    const effect = new SSAOEffect(camera, normalPass.texture)
    setSSAOEffect(effect)

    return () => {
        setSSAOEffect(undefined)
        effect.dispose()
    }
}, [getSSAO, getCameraRendered, getNormalPass])
