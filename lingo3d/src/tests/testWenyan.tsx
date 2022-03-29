//@ts-ignore
import botSrc from "../../assets-local/bot.fbx"
//@ts-ignore
import runningSrc from "../../assets-local/running.fbx"
//@ts-ignore
import idleSrc from "../../assets-local/idle.fbx"
//@ts-ignore
import aimSrc from "../../assets-local/aim.fbx"
//@ts-ignore
import aimWalkSrc from "../../assets-local/aim-walk.fbx"
//@ts-ignore
import recoilSrc from "../../assets-local/recoil.fbx"

import Model from "../display/Model"
import keyboard from "../api/keyboard"
import { endPoint, mapRange } from "@lincode/math"
import Sky from "../display/Sky"
import Reflector from "../display/Reflector"
import { random } from "@lincode/utils"
import mouse from "../api/mouse"
// import Spring from "../api/Spring"
import store, { createEffect } from "@lincode/reactivity"
import Octahedron from "../display/primitives/Octahedron"
import Cube from "../display/primitives/Cube"
import randomColor from "randomcolor"
import DirectionalLight from "../display/lights/DirectionalLight"
import { settings } from ".."
import ThirdPersonCamera from "../display/cameras/ThirdPersonCamera"

export default {}

const canvas = document.createElement("canvas")
canvas.width = 200
canvas.height = 256

const context = canvas.getContext("2d")!
context.font = "bold 200px Arial"
context.fillStyle = "white"

export const text2ImageData = (text: string) => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillText(text, 0, 200)
    return canvas.toDataURL("image/png")
}

settings.fillWindow = true

const model = new Model()
model.src = botSrc
model.width = 30
model.depth = 30
model.y = 50
model.physics = true
model.noTumble = true
model.physicsGroup = 2

model.loadAnimation(runningSrc, "running")
model.loadAnimation(idleSrc, "idle")
model.loadAnimation(aimSrc, "aim")
model.loadAnimation(aimWalkSrc, "aimWalk")
model.loadAnimation(recoilSrc, "recoil")
model.playAnimation("idle")

const makeText = (angle: number, distance: number, y: number, speed: number, char: string, errors: Array<string>) => {
    const text = new Cube()
    text.depth = 1
    text.scale = 2
    text.id = "text"
    text.name = errors.includes(char) ? "error" : ""
    text.texture = text2ImageData(char)
    text.opacity = 0.9
    text.color = "yellow"

    const pt = endPoint(0, 0, angle, distance * 0.5)
    text.innerX = pt.x
    text.innerZ = pt.y
    text.innerRotationY = -angle - 90

    text.y = y
    text.onLoop = () => {
        text.rotationY += speed
    }

    // text.animation.y = [y - 100, y + 100, y - 100]
    // text.animation.duration = random(2000, 5000)
}

let flip = true
let y = 0

const makeRow = (text: string, errors: Array<string>) => {
    const coeff = (flip = !flip) ? 1 : -1
    const speed = random(-0.05, -0.1)
    y += 1
    const step = 300 / text.length
    for (let i = 0; i < text.length; ++i) {
        makeText(i * step, 2000, y * 500, speed, text[i], errors)
    }
}

makeRow("虽有智慧，不如沉势；虽有滋基，不如待时。", ["滋", "沉"])
makeRow("山径之溪间，介然用之而成路，为闲不用，则茅塞之以。", ["溪", "以"])
makeRow("自反而不缩，虽竭全宽博，吾不揣焉；自反而缩，虽千万人，吾往矣。", ["竭", "揣"])
makeRow("离娄之明，公枢子之巧；不以规矩，不成方园。", ["枢", "园"])

const stackSize = 5

for (let j = 1; j <= stackSize; ++j) {
    for (let i = -stackSize + j; i <= stackSize - j; ++i) {
        const cube = new Cube()
        cube.scale = mapRange(j, 1, stackSize, 0.5, 0.2)
        cube.x = i * 60
        cube.y = j * 50
        cube.z = 500
        cube.mass = mapRange(j, 1, stackSize, 1, 0.001)
        cube.physics = true
        cube.color = cube.emissiveColor = randomColor()
        cube.bloom = true
    }
}

const sky = new Sky()

const reflector = new Reflector()
reflector.width = 10000
reflector.height = 10000
reflector.rotationX = -90
reflector.shape = "circle"
reflector.physics = true
reflector.mass = 0

const cam = new ThirdPersonCamera()
cam.mouseControl = true
cam.activate()
cam.innerX = 20
cam.minPolarAngle = 70
cam.target = model

// const camSpring = cam.watch(new Spring())
// camSpring.from = 1
// camSpring.onChange = val => {
//     cam.zoom = val * 0.8
//     cam.innerX = 20 * val
// }

const [setAim, getAim] = store(false)
const [setRecoil, getRecoil] = store(false)
const [setRunning, getRunning] = store(false)

createEffect(() => {
    const aim = getAim()
    const recoil = getRecoil()
    const running = getRunning()
    
    if (recoil) {
        model.playAnimation("recoil", { repeat: false, onFinish: () => setRecoil(false) })
        return
    }
    if (aim && running) {
        model.playAnimation("aimWalk")
        model.onLoop = () => {
            model.moveForward(-1)
        }
        return () => {
            model.onLoop = undefined
        }
    }
    if (running) {
        model.playAnimation("running")
        model.onLoop = () => {
            model.moveForward(-5)
        }
        return () => {
            model.onLoop = undefined
        }
    }
    if (aim) {
        model.playAnimation("aim")
        return
    }
    else {
        model.playAnimation("idle")
        return
    }
}, [getAim, getRecoil, getRunning])

// getAim((aim) => {
//     if (aim)
//         camSpring.to = 1.5
//     else
//         camSpring.to = 1
// })

model.onLoad = () => {
    const rightHand = model.find("mixamorigRightHandRing4")
    if (!rightHand) return

    createEffect(() => {
        const aim = getAim()
        if (!aim) return

        const bolt = new Octahedron()
        bolt.scale = 0.1
        bolt.depth = 2000
        // bolt.bloom = true
        bolt.onLoop = () => {
            bolt.placeAt(rightHand)

            const camPoint = cam.pointAt(1000)
            camPoint.y += 200

            bolt.lookAt(camPoint)
            bolt.translateZ(50)
        }

        return () => {
            bolt.onLoop = undefined
            bolt.physics = true
            bolt.ignorePhysicsGroups = [2]
            bolt.applyLocalImpulse(0, 0, 50)
            bolt.timer(5000, () => bolt.dispose())

            // bolt.listenToIntersection("text", t => {
            //     if (t.name === "error") {
            //         setProgress(getProgress() + (100 / 8))
            //     }
            //     t.dispose()
            // })
        }
    }, [getAim])
}

mouse.onMouseDown = () => {
    setAim(true)
}

mouse.onMouseUp = () => {
    setAim(false)
    setRecoil(true)
}

settings.gridHelper = true

keyboard.onKeyDown = (key) => {
    if (key === "w")
        setRunning(true)
}

keyboard.onKeyUp = (key) => {
    if (key === "w")
        setRunning(false)
}

settings.defaultLight = false

const l0 = new DirectionalLight()
l0.innerZ = -100
l0.intensity = 0.25

const l1 = new DirectionalLight()
l1.innerZ = -0
l1.intensity = 0.25

const l2 = new DirectionalLight()
l2.innerZ = 100
l2.intensity = 0.25

const l3 = new DirectionalLight()
l3.innerZ = -100
l3.innerX = -100
l3.intensity = 0.25

const l4 = new DirectionalLight()
l4.innerZ = -0
l4.innerX = -100
l4.intensity = 0.25

const l5 = new DirectionalLight()
l5.innerZ = 100
l5.innerX = -100
l5.intensity = 0.25

const l6 = new DirectionalLight()
l6.innerZ = -100
l6.innerX = 100
l6.intensity = 0.25

const l7 = new DirectionalLight()
l7.innerZ = -0
l7.innerX = 100
l7.intensity = 0.25

const l8 = new DirectionalLight()
l8.innerZ = 100
l8.innerX = 100
l8.intensity = 0.25
