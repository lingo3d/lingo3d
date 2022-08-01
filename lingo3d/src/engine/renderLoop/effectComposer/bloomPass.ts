import { Vector2 } from "three"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { getBloomRadius } from "../../../states/useBloomRadius"
import { getBloomStrength } from "../../../states/useBloomStrength"
import { getBloomThreshold } from "../../../states/useBloomThreshold"

const bloomPass = new UnrealBloomPass(
    new Vector2(),
    getBloomStrength(),
    getBloomRadius(),
    getBloomThreshold()
)
export default bloomPass

getBloomRadius((val) => (bloomPass.radius = val))
getBloomStrength((val) => (bloomPass.strength = val))
getBloomThreshold((val) => (bloomPass.threshold = val))
