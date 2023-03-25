import { Fog, Scene } from "three"
import { whiteColor } from "../display/utils/reusables"
import { FAR, CSM_FAR } from "../globals"

const scene = new Scene()
export default scene

scene.fog = new Fog(whiteColor, CSM_FAR, FAR * 2)
