import store, { createEffect } from "@lincode/reactivity"
import { SAOPass } from "three/examples/jsm/postprocessing/SAOPass"
import { getAmbientOcclusion } from "../../../states/useAmbientOcclusion"
import { getCameraRendered } from "../../../states/useCameraRendered"
import scene from "../../scene"

const [setSAOPass, getSAOPass] = store<SAOPass | undefined>(undefined)
export { getSAOPass }

createEffect(() => {
    if (!getAmbientOcclusion()) return

    const saoPass = new SAOPass(scene, getCameraRendered(), false, true)
    setSAOPass(saoPass)

    saoPass.params.saoKernelRadius = 80
    saoPass.params.saoBlurStdDev = 5

    const handle = getAmbientOcclusion(ao => saoPass.params.saoScale = ao === "light" ? 3000 : 2000)

    return () => {
        setSAOPass(undefined)
        handle.cancel()
    }
}, [getCameraRendered, getAmbientOcclusion])