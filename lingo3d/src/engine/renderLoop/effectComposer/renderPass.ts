import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { getCameraRendered } from "../../../states/useCameraRendered"
import scene from "../../scene"

const renderPass = new RenderPass(scene, getCameraRendered())
export default renderPass

getCameraRendered(camera => renderPass.camera = camera)