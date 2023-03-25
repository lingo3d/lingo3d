import { Fog, Scene } from "three"
import { blackColor, whiteColor } from "../display/utils/reusables"
import { NEAR, FAR } from "../globals"

const scene = new Scene()
export default scene

scene.fog = new Fog(whiteColor, 50, FAR * 2)
