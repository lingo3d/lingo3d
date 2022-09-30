import store, { createEffect } from "@lincode/reactivity"
import { NormalPass } from "postprocessing"
import { getCameraRendered } from "../../../states/useCameraRendered"
import { getSSAO } from "../../../states/useSSAO"
import scene from "../../scene"

const [setNormalPass, getNormalPass] = store<NormalPass | undefined>(undefined)
export { getNormalPass }

createEffect(() => {
    if (!getSSAO()) return

    const normalPass = new NormalPass(scene, getCameraRendered())
    setNormalPass(normalPass)

    return () => {
        setNormalPass(undefined)
        normalPass.dispose()
    }
}, [getSSAO, getCameraRendered])
