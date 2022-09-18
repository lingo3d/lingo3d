import {
    Dummy,
    keyboard,
    Model,
    ThirdPersonCamera,
    settings,
    SpawnPoint,
    Sky,
    preload
} from ".."
import { YBOT_URL } from "../globals"

const spawn = new SpawnPoint()
spawn.id = "spawn"
spawn.x = -3888.93
spawn.y = -3278.18
spawn.z = -976.08

const world = new Model()
world.src = "map.fbx"
world.resize = false
world.scale = 0.04
world.physics = "map"
world.frustumCulled = false
world.metalnessFactor = 0.1
world.onLoad = () => {
    const found = world.find("YJXZ_shui")
    if (!found) return
    found.bloom = true
    found.videoTexture = "water.webm"
    found.emissive = true
    // found.emissiveIntensity = 0.2
}

const player = new Dummy()
player.y = 6000
player.physics = "character"
player.strideMove = true
player.strideMode = "free"
player.src = "awei/awei.fbx"
player.scale = 3
player.animations = {
    idle: "awei/idle.fbx",
    running: "awei/running.fbx"
}
player.placeAt("spawn")

const cam = new ThirdPersonCamera()
cam.append(player)
cam.transition = true
cam.mouseControl = "drag"
cam.innerZ = 2000
cam.fov = 45
cam.lockTargetRotation = "dynamic-lock"
cam.active = true

keyboard.onKeyPress = (_, key) => {
    if (key.has("w")) player.strideForward = -10
    else if (key.has("s")) player.strideForward = 10
    else player.strideForward = 0

    if (key.has("a")) player.strideRight = 10
    else if (key.has("d")) player.strideRight = -10
    else player.strideRight = 0
}

keyboard.onKeyDown = (key) => {
    if (key === "Space") player.jump(10)
}

settings.texture = "bg.png"
settings.centripetal = true
