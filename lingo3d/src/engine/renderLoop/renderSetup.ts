import { LinearEncoding, LinearToneMapping, NoToneMapping, PCFSoftShadowMap, sRGBEncoding } from "three"
import { getExposure } from "../../states/useExposure"
import ResizeObserver from "resize-observer-polyfill"
import { getResolution } from "../../states/useResolution"
import { getPerformance } from "../../states/usePerformance"
import { getPixelRatio } from "../../states/usePixelRatio"
import { VRButton } from "three/examples/jsm/webxr/VRButton"
import { createEffect } from "@lincode/reactivity"
import { getVR } from "../../states/useVR"
import settings from "../../api/settings"
import { getRenderer } from "../../states/useRenderer"
import { getEncoding } from "../../states/useEncoding"
import { getPBR } from "../../states/usePBR"
import { setFillWindow } from "../../states/useFillWindow"

export const container = document.createElement("div")
Object.assign(container.style, {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "100%",
    height: "100%"
})
export const containerBounds = [container.getBoundingClientRect()]
const resizeObserver = new ResizeObserver(() => containerBounds[0] = container.getBoundingClientRect())
resizeObserver.observe(container)

queueMicrotask(() => {
    if (!settings.autoMount || container.parentElement) return
    document.body.appendChild(container)
    setFillWindow(true)
})

export const referenceOutline = document.createElement("div")
Object.assign(referenceOutline.style, {
    border: "1px solid blue",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translateX(-50%) translateY(-50%)"
})

createEffect(() => {
    const canvas = getRenderer().domElement
    container.appendChild(canvas)
    container.appendChild(referenceOutline)
    Object.assign(canvas.style, { position: "absolute", left: "0px", top: "0px" })
    return () => {
        container.removeChild(canvas)
    }
}, [getRenderer])

createEffect(() => {
    const renderer = getRenderer()

    const [w, h] = getResolution()
    renderer.setSize(w, h)
    renderer.setPixelRatio(getPixelRatio())

}, [getRenderer, getResolution, getPixelRatio])

createEffect(() => {
    const renderer = getRenderer()

    // renderer.shadowMap.type = PCFSoftShadowMap
    renderer.shadowMap.enabled = getPerformance() !== "speed"

}, [getRenderer, getPerformance])

createEffect(() => {
    const renderer = getRenderer()
    renderer.physicallyCorrectLights = getPBR()

}, [getRenderer, getPBR])

createEffect(() => {
    const renderer = getRenderer()
    const exposure = getExposure()

    renderer.toneMapping = exposure !== 1 ? LinearToneMapping : NoToneMapping
    renderer.toneMappingExposure = exposure

}, [getExposure, getRenderer])

createEffect(() => {
    const renderer = getRenderer()
    const encoding = getEncoding()

    renderer.outputEncoding = encoding === "linear" ? LinearEncoding : sRGBEncoding

}, [getEncoding, getRenderer])

createEffect(() => {
    if (getVR() !== "webxr") return

    const renderer = getRenderer()
    renderer.xr.enabled = true
    
    const button = VRButton.createButton(renderer)
    container.appendChild(button)

    button.ontouchstart = () => button.onclick?.(new MouseEvent("click"))

    return () => {
        renderer.xr.enabled = false
        container.removeChild(button)
    }
}, [getVR, getRenderer])