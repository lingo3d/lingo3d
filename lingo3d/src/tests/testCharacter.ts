export default {}

import { Model, keyboard, Sky, Reflector, mouse, Octahedron, ThirdPersonCamera } from "../index"

import store, { createEffect, createNestedEffect } from "@lincode/reactivity"
import { Cancellable } from "@lincode/promiselikes"
import { setGridHelper } from "../states/useGridHelper"

const model = new Model()
model.src = "bot.fbx"
model.width = 30
model.depth = 30
model.y = 50
model.physics = true
model.noTumble = true
model.physicsGroup = 2
model.slippery = true

model.loadAnimation("running.fbx")
model.loadAnimation("idle.fbx")
model.loadAnimation("aim.fbx")
model.loadAnimation("aim-walk.fbx")
model.loadAnimation("recoil.fbx")
model.loadAnimation("falling.fbx")

const sky = new Sky()

const reflector = new Reflector()
reflector.width = 10000
reflector.height = 10000
reflector.rotationX = -90
reflector.physics = true
reflector.mass = 0

const cam = new ThirdPersonCamera()
cam.y = 100
cam.rotationY = 180
cam.mouseControl = true
cam.activate()
cam.innerX = 20
cam.append(model)

// const camSpring = cam.watch(new Spring())
// camSpring.from = 1
// camSpring.onChange = val => {
//     cam.zoom = val * 0.8
//     cam.innerX = 20 * val
// }

const [setAim, getAim] = store(false)
const [setRecoil, getRecoil] = store(false)
const [setRunning, getRunning] = store(false)
const [setJump, getJump] = store(false)
const [setAirborn, getAirborn] = store(false)

const useFireBolt = (aim: boolean) => createNestedEffect(() => {
    // if (aim)
    //     camSpring.to = 1.5
    // else
    //     camSpring.to = 1

    const rightHand = model.find("mixamorigRightHandRing4")
    if (!rightHand || !aim) return

    const bolt = new Octahedron()
    bolt.scale = 0.1
    bolt.depth = 2000
    // bolt.bloom = true
    bolt.onLoop = () => {
        bolt.placeAt(rightHand)
        const targetPoint = cam.pointAt(1000)
        targetPoint.y += 200
        bolt.lookAt(targetPoint)
    }

    return () => {
        setRecoil(true)
        
        bolt.onLoop = undefined
        bolt.physics = true
        bolt.ignorePhysicsGroups = [2]
        bolt.applyLocalImpulse(0, 0, 50)
        bolt.timer(5000, 0, () => bolt.dispose())
    }
}, [aim])

const useDetectLanding = (airborn: boolean) => createNestedEffect(() => {
    if (!airborn) return

    model.playAnimation("falling.fbx")

    const handle = new Cancellable()
    const timeout = setTimeout(() => {
        model.onLoop = () => {
            if (model.intersects(reflector)) {
                setAirborn(false)
                setJump(false)
            }
        }
        handle.then(() => {
            model.onLoop = undefined
        })
    }, 100)

    return () => {
        clearTimeout(timeout)
        handle.cancel()
    }
}, [airborn])

createEffect(() => {
    const aim = getAim()
    const recoil = getRecoil()
    const running = getRunning()
    const jump = getJump()
    const airborn = getAirborn()

    useDetectLanding(airborn)
    if (airborn) return

    if (jump) {
        if (aim) {
            setJump(false)
            return
        }
        model.applyImpulse(0, 10, 0)
        setAirborn(true)
        return
    }

    useFireBolt(aim)

    if (recoil) {
        model.playAnimation("recoil.fbx", { repeat: false, onFinish: () => setRecoil(false) })
        Object.assign(model.velocity, { x: 0, y: 0, z: 0 })
        return
    }

    if (aim && running) {
        model.playAnimation("aim-walk.fbx")
        model.onLoop = () => {
            model.moveForward(-1)   
        }
        return () => {
            model.onLoop = undefined
        }
    }
    if (running) {
        model.playAnimation("running.fbx")
        model.onLoop = () => {
            model.moveForward(-5)
        }
        return () => {
            model.onLoop = undefined
        }
    }
    if (aim) {
        model.playAnimation("aim.fbx")
        return
    }

    model.playAnimation("idle.fbx")
    Object.assign(model.velocity, { x: 0, y: 0, z: 0})

}, [getAim, getRecoil, getRunning, getJump, getAirborn])

mouse.onMouseDown = () => {
    setAim(true)
}

mouse.onMouseUp = () => {
    setAim(false)
}

setGridHelper(true)

keyboard.onKeyDown = (key) => {
    if (key === "w")
        setRunning(true)
    else if (key === "Space")
        setJump(true)
}

keyboard.onKeyUp = (key) => {
    if (key === "w")
        setRunning(false)
}