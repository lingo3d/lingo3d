import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { getCamera } from "../../../states/useCamera"
import scene from "../../scene"

const renderPass = new RenderPass(scene, getCamera())
export default renderPass

getCamera(camera => renderPass.camera = camera)