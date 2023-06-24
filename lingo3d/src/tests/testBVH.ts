import Model from "../display/Model"
import ThirdPersonCamera from "../display/cameras/ThirdPersonCamera"
import Dummy from "../display/Dummy"
import stateMachine from "./stateMachine"
import { interpret } from "xstate"
import { createEffect, store } from "@lincode/reactivity"
import { PointLight, keyboard } from ".."

//create map model
const map = new Model()
map.src = "fairy.glb"
map.scale = 30
map.physics = "map"

//create player dummy
const player = new Dummy()
player.src = "ready.glb"
player.animations = {
    idle: "animations/idle.fbx",
    running: "animations/running.fbx",
    runningBackwards: "animations/running-backwards.fbx",
    jumping: "animations/falling.fbx",
    flip: "animations/flip.fbx"
}
player.z = -100
player.y = 2000
player.physics = "character"

// setTimeout(() => {
//     player2.animation = ["running", "jumping", "death"]
// }, 5000)

//set player and map hit detection
//useful for detecting when player has landed
player.hitTarget = map.uuid

//instantiate state machine
const service = interpret(stateMachine)

//when player hits map, aka when player lands
player.onHitStart = (ev) => {
    if (ev.target === map) {
        // console.log("landed")
        service.send("JUMP_STOP")
    }
}

//when player is airborn
//useless for now
player.onHitEnd = (ev) => {
    if (ev.target === map) {
        // console.log("airborn")
    }
}

//react-like state for poses such as idle, jumping, doubleJumping, running, etc
const [setPose, getPose] = store("idle")

//react-like effect that runs when getPose changes
createEffect(() => {
    const pose = getPose()

    if (pose === "idle") {
        player.animation = "idle"
    } else if (pose === "jumping") {
        player.animation = "jumping"
        player.velocityY = 10
    } else if (pose === "double_jumping") {
        player.animation = "flip"
        player.velocityY = 10
        player.animationFrame = 20

        //wait for 500ms to end double jumping animation
        const timeout = setTimeout(() => {
            player.animation = "jumping"
        }, 500)

        return () => {
            clearTimeout(timeout)
        }
    } else if (pose === "running") {
        player.animation = "running"
    } else if (pose === "runningBackwards") {
        player.animation = "runningBackwards"
    }
}, [getPose])

//send pose state from state machine to react-like effect
service.onTransition((state) => {
    if (state.changed) setPose(state.value as any)
})
service.start()

//detect space key for jump
keyboard.onKeyDown = (ev) => {
    if (ev.key === "Space") {
        service.send("DOUBLE_JUMP_START")
        service.send("JUMP_START")
    }
}

//detect w or s keyup for idle
keyboard.onKeyUp = (ev) => {
    if (ev.key === "w" || ev.key === "s") service.send("RUN_STOP")
}

//detect w or s keypress for running
keyboard.onKeyPress = (ev) => {
    if (ev.keys.has("w")) {
        player.moveForward(-5)
        service.send("RUN_START")
    } else if (ev.keys.has("s")) {
        player.moveForward(5)
        service.send("RUN_BACKWARDS_START")
    }
}

//camera
const cam = new ThirdPersonCamera()
cam.append(player)
cam.mouseControl = "drag"
cam.active = true
