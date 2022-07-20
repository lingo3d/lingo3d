import ThirdPersonCamera from "../display/cameras/ThirdPersonCamera"
import Model from "../display/Model"
import Cube from "../display/primitives/Cube"

export default {}

const cube = new Cube()

const cam = new ThirdPersonCamera()

cam.append(cube)
cam.activate()