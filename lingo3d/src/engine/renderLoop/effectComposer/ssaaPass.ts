import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass"
import { getCameraRendered } from "../../../states/useCameraRendered"
import scene from "../../scene"

export default new SSAARenderPass(scene, getCameraRendered())