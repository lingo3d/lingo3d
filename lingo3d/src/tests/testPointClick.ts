
import { ThirdPersonCamera, Dummy, Reflector, settings } from ".."

export default {}

settings.gridHelper = true

const reflector = new Reflector()
reflector.scale = 100
reflector.physics = "map"
reflector.roughnessMap = "roughness.png"
reflector.normalMap = "normal.jpg"
reflector.roughness = 5
reflector.onClick = e => {
    console.log(e)
}

reflector.onClick = e => {
    console.log(e)
}

const dummy = new Dummy()
dummy.y = 170 * 0.5
dummy.physics = "character"

const cam = new ThirdPersonCamera()
cam.append(dummy)
cam.activate()
cam.mouseControl = "drag"