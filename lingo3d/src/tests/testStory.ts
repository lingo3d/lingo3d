import { distance3d } from "@lincode/math"
import {
    DefaultSkyLight,
    Dummy,
    Model,
    PooledPointLight,
    Sprite,
    ThirdPersonCamera,
    createSystem,
    keyboard,
    onBeforeRender,
    settings
} from ".."
import Cube from "../display/primitives/Cube"
import createElement from "../utils/createElement"
import { container, uiContainer } from "../engine/renderLoop/containers"
import { store } from "@lincode/reactivity"

settings.exposure = 0.5
settings.environment = "studio"
settings.bloom = true
settings.ssr = true
settings.vignette = true
settings.pixelRatio = 0.75

const pub = new Model()
pub.src = "british_pub/scene.gltf"
pub.scale = 5
pub.roughnessFactor = 0
pub.physics = "map"

const light = new DefaultSkyLight()
light.shadows = false

const player = new Dummy()
player.x = 550.51
player.y = -71.13
player.z = -400.0
player.physics = "character"
player.roughnessFactor = 0
player.strideMove = true

const tommy = new Model()
tommy.src = "tommy/scene.gltf"
tommy.scale = 1.7
tommy.x = 493.49
tommy.y = -71.13
tommy.z = -228.82
tommy.rotationY = 45.00
tommy.rotationX = -180
tommy.rotationZ = -180

keyboard.onKeyPress = (ev) => {
    if (ev.keys.has("w")) {
        player.strideForward = -5
    } else if (ev.keys.has("s")) {
        player.strideForward = 5
    }
}

keyboard.onKeyUp = (ev) => {
    player.strideForward = 0
    player.strideRight = 0
}

//camera
const cam = new ThirdPersonCamera()
cam.append(player)
cam.mouseControl = "drag"
cam.active = true
cam.innerZ = 150
cam.innerY = 50
cam.innerX = 50
cam.lockTargetRotation = "dynamic-lock"

const [setSpeaking, getSpeaking] = store(false)

const indicator = createElement(`
    <div class="lingo3d-absfull lingo3d-flexcenter" style="z-index: 9999; pointer-events: none">press space bar to speak</div>
`) as HTMLDivElement
container.appendChild(indicator)

tommy.onLoop = () => {
    if (tommy.position.distanceTo(player.position) < 1) {
        indicator.style.display = "block"
        setSpeaking(true)
    }
    else {
        indicator.style.display = "none"
        setSpeaking(false)
    }
}