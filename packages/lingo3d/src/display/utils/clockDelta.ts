import { Clock } from "three"
import { loop } from "../../engine/eventLoop"

const clockDelta = [0]
export default clockDelta

const clock = new Clock()
loop(() => clockDelta[0] = clock.getDelta())