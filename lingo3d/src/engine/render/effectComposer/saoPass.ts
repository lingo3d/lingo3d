import { SAOPass } from "three/examples/jsm/postprocessing/SAOPass"
import { getCamera } from "../../../states/useCamera"
import { getResolution } from "../../../states/useResolution"
import scene from "../../scene"

const saoPass = new SAOPass(scene, getCamera(), false, true)
export default saoPass

saoPass.params.saoKernelRadius = 80
saoPass.params.saoScale = 2000
saoPass.params.saoBlurStdDev = 5

getResolution(([w, h]) => saoPass.setSize(w, h))
getCamera(camera => saoPass.camera = camera)