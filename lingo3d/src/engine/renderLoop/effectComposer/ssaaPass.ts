import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass"
import { getCameraRendered } from "../../../states/useCameraRendered"
import scene from "../../scene"

const ssaaPass = new SSAARenderPass(scene, getCameraRendered())
export default ssaaPass

ssaaPass.sampleLevel = 4

getCameraRendered(camera => ssaaPass.camera = camera)