import { Clock } from "three"

const clockDelta = [0]
export default clockDelta

const clock = new Clock()
const loop = () => {
    requestAnimationFrame(loop)
    clockDelta[0] = clock.getDelta()
}
loop()