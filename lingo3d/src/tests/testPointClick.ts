
import { ThirdPersonCamera, Dummy, Reflector, settings, Cube } from ".."

settings.gridHelper = true

const reflector = new Reflector()
reflector.scale = 100
reflector.physics = "map"
reflector.onClick = e => {
    console.log(e)
}

const marker = new Cube()

reflector.onClick = e => {
    marker.placeAt(e.point)
    marker.y += 50
    dummy.lookTo(e.point.x, undefined, e.point.z, 0.1)
    dummy.moveTo(e.point.x, undefined, e.point.z, 5)
}

const dummy = new Dummy()
dummy.y = 170 * 0.5
dummy.physics = "character"

const cam = new ThirdPersonCamera()
cam.append(dummy)
cam.active = true
cam.mouseControl = "drag"
cam.lockTargetRotation = false