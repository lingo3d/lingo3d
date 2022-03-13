import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { getCameraDistance } from "../states/useCameraDistance"
import { getOrbitControls } from "../states/useOrbitControls"
import { container } from "./render/renderer"
import { createEffect } from "@lincode/reactivity"
import { deg2Rad, rad2Deg } from "@lincode/math"
import mainCamera from "./mainCamera"
import { getCamera } from "../states/useCamera"
import { setSelectionEnabled } from "../states/useSelectionEnabled"
import { getOrbitControlsEnabled } from "../states/useOrbitControlsEnabled"
import { getOrbitControlsScreenSpacePanning } from "../states/useOrbitControlsScreenSpacePanning"
import { emitOrbitControls } from "../events/onOrbitControls"
import { vector3 } from "../display/utils/reusables"

export default {}

const mainOrbitControls = new OrbitControls(mainCamera, container)

getOrbitControlsScreenSpacePanning(val => mainOrbitControls.screenSpacePanning = val)

const setRotationY = (val: number) => {
    mainOrbitControls.minAzimuthAngle = mainOrbitControls.maxAzimuthAngle = val * deg2Rad
    mainOrbitControls.update()

    queueMicrotask(() => {
        mainOrbitControls.minAzimuthAngle = -Infinity
        mainOrbitControls.maxAzimuthAngle = Infinity
    })
}

const setRotationX = (val: number) => {
    mainOrbitControls.minPolarAngle = mainOrbitControls.maxPolarAngle = (val + 90) * deg2Rad
    mainOrbitControls.update()

    queueMicrotask(() => {
        mainOrbitControls.minPolarAngle = -Infinity
        mainOrbitControls.maxPolarAngle = Infinity
    })
}

const setDistance = (val: number) => {
    mainOrbitControls.minDistance = mainOrbitControls.maxDistance = val
    mainOrbitControls.update()

    queueMicrotask(() => {
        mainOrbitControls.minDistance = -Infinity
        mainOrbitControls.maxDistance = Infinity
    })
}

createEffect(() => {
    const orbitControls = getOrbitControls()
    const orbitControlsEnabled = getOrbitControlsEnabled()
    const camera = getCamera()
    
    mainOrbitControls.enabled = orbitControls && orbitControlsEnabled && camera === mainCamera
    container.style.cursor = mainOrbitControls.enabled ? "grab" : "auto"

}, [getOrbitControls, getOrbitControlsEnabled, getCamera])

createEffect(() => {
    const orbitControls = getOrbitControls()
    if (!orbitControls) return

    let signal = true
    queueMicrotask(() => signal && setRotationX(-30))

    return () => {
        signal = false
        mainOrbitControls.reset()
        setRotationX(0)
        setRotationY(0)
        setDistance(getCameraDistance())
    }
}, [getOrbitControls])

let azimuthStart = 0
let polarStart = 0
let targetStart = vector3
let started = false

mainOrbitControls.addEventListener("start", () => {
    started = true
    azimuthStart = mainOrbitControls.getAzimuthalAngle() * rad2Deg
    polarStart = mainOrbitControls.getPolarAngle() * rad2Deg
    targetStart = mainOrbitControls.target.clone()
    emitOrbitControls("start")
})

mainOrbitControls.addEventListener("change", () => {
    if (!started) return
    const azimuthDiff = Math.abs(mainOrbitControls.getAzimuthalAngle() * rad2Deg - azimuthStart)
    const polarDiff = Math.abs(mainOrbitControls.getPolarAngle() * rad2Deg - polarStart)

    const { x, y, z } = mainOrbitControls.target
    const { x: x0, y: y0, z: z0 } = targetStart
    const targetDiff = Math.max(Math.abs(x0 - x), Math.abs(y0 - y), Math.abs(z0 - z))

    if (azimuthDiff > 2 || polarDiff > 2 || targetDiff > 0.02) {
        setSelectionEnabled(false)
        emitOrbitControls("move")
    }
})

mainOrbitControls.addEventListener("end", () => {
    started = false
    setSelectionEnabled(true)
    emitOrbitControls("stop")
})