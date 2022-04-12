import { Vector2 } from "three"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass"
import { getCamera } from "../../../states/useCamera"
import { getOutlined } from "../../../states/useOutlined"
import scene from "../../scene"

const outlinePass = new OutlinePass(new Vector2(), scene, getCamera())
export default outlinePass

getCamera(camera => outlinePass.renderCamera = camera)
getOutlined(outlined => outlinePass.selectedObjects = outlined)