import { SAOPass } from "three/examples/jsm/postprocessing/SAOPass"
import { getAmbientOcclusion } from "../../../states/useAmbientOcclusion"
import { getCamera } from "../../../states/useCamera"
import scene from "../../scene"

const saoPass = new SAOPass(scene, getCamera(), false, true)
export default saoPass

saoPass.params.saoKernelRadius = 80
saoPass.params.saoBlurStdDev = 5

getAmbientOcclusion(ao => saoPass.params.saoScale = ao === "light" ? 3000 : 2000)
getCamera(camera => saoPass.camera = camera)