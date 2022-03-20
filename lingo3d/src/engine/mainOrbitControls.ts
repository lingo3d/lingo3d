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
    const enabled = getOrbitControls() && getOrbitControlsEnabled() && getCamera() === mainCamera
    
    mainOrbitControls.enabled = enabled
    container.style.cursor = enabled ? "grab" : "auto"

}, [getOrbitControls, getOrbitControlsEnabled, getCamera])

createEffect(() => {
    const orbitControls = getOrbitControls()
    if (!orbitControls) return

    let proceed = true
    queueMicrotask(() => proceed && setRotationX(-30))

    return () => {
        proceed = false
        mainOrbitControls.reset()
        setRotationX(0)
        setRotationY(0)
        setDistance(getCameraDistance())
    }
}, [getOrbitControls])

export const orbitControlsBlockSelection = (controls: OrbitControls, isMainCamera?: boolean) => {
    let azimuthStart = 0
    let polarStart = 0
    let targetStart = vector3
    let started = false

    controls.addEventListener("start", () => {
        started = true
        azimuthStart = controls.getAzimuthalAngle() * rad2Deg
        polarStart = controls.getPolarAngle() * rad2Deg
        targetStart = controls.target.clone()
        isMainCamera && emitOrbitControls("start")
    })

    controls.addEventListener("change", () => {
        if (!started) return
        const azimuthDiff = Math.abs(controls.getAzimuthalAngle() * rad2Deg - azimuthStart)
        const polarDiff = Math.abs(controls.getPolarAngle() * rad2Deg - polarStart)
    
        const { x, y, z } = controls.target
        const { x: x0, y: y0, z: z0 } = targetStart
        const targetDiff = Math.max(Math.abs(x0 - x), Math.abs(y0 - y), Math.abs(z0 - z))
    
        if (azimuthDiff > 2 || polarDiff > 2 || targetDiff > 0.02) {
            setSelectionEnabled(false)
            isMainCamera && emitOrbitControls("move")
        }
    })
    
    controls.addEventListener("end", () => {
        started = false
        setSelectionEnabled(true)
        isMainCamera && emitOrbitControls("stop")
    })
}

orbitControlsBlockSelection(mainOrbitControls, true)