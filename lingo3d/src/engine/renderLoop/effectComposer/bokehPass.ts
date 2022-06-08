import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass"
import scene from "../../scene"
import { getBokehFocus } from "../../../states/useBokehFocus"
import { getBokehAperture } from "../../../states/useBokehAperture"
import { getBokehMaxBlur } from "../../../states/useBokehMaxBlur"
import { getCameraRendered } from "../../../states/useCameraRendered"

const bokehPass = new BokehPass(scene, getCameraRendered(), {})
export default bokehPass

getCameraRendered(camera => bokehPass.camera = camera)

const uniforms = bokehPass.uniforms as any

getBokehFocus(val => uniforms["focus"].value = val)
getBokehAperture(val => uniforms["aperture"].value = val)
getBokehMaxBlur(val => uniforms["maxblur"].value = val)