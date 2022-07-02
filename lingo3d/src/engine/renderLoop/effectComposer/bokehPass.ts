import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass"
import scene from "../../scene"
import { getBokehFocus } from "../../../states/useBokehFocus"
import { getBokehAperture } from "../../../states/useBokehAperture"
import { getBokehMaxBlur } from "../../../states/useBokehMaxBlur"
import { getCameraRendered } from "../../../states/useCameraRendered"
import store, { createEffect } from "@lincode/reactivity"
import { getBokeh } from "../../../states/useBokeh"

const [setBokehPass, getBokehPass] = store<BokehPass | undefined>(undefined)
export { getBokehPass }

createEffect(() => {
    if (!getBokeh()) return

    const bokehPass = new BokehPass(scene, getCameraRendered(), {})
    setBokehPass(bokehPass)

    const uniforms = bokehPass.uniforms as any

    const handle0 = getBokehFocus(val => uniforms["focus"].value = val)
    const handle1 = getBokehAperture(val => uniforms["aperture"].value = val)
    const handle2 = getBokehMaxBlur(val => uniforms["maxblur"].value = val)
    
    return () => {
        setBokehPass(undefined)
        handle0.cancel()
        handle1.cancel()
        handle2.cancel()
    }
}, [getCameraRendered, getBokeh])