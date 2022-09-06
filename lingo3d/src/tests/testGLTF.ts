import store from "@lincode/reactivity"
import mouse from "../api/mouse"
import settings from "../api/settings"
import OrbitCamera from "../display/cameras/OrbitCamera"
import Model from "../display/Model"
import Cube from "../display/primitives/Cube"

export default {}

const cam1 = new OrbitCamera()
const cam2 = new OrbitCamera()
cam2.y = 100
cam1.transition = 0.03
cam2.transition = 0.03

const box = new Cube()

const [setNum, getNum] = store(0)

getNum((num) => {
    cam1.active = num === 0
    cam2.active = num === 1
})

mouse.onClick = () => {
    setNum(getNum() === 0 ? 1 : 0)
}
