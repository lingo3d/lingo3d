import { LinearEncoding, LinearToneMapping, NoToneMapping, PCFSoftShadowMap, sRGBEncoding } from "three"
import { getExposure } from "../../states/useExposure"
import { getResolution, setResolution } from "../../states/useResolution"
import { getPerformance } from "../../states/usePerformance"
import { getPixelRatio } from "../../states/usePixelRatio"
import { createEffect } from "@lincode/reactivity"
import { getVR } from "../../states/useVR"
import settings from "../../api/settings"
import { getRenderer } from "../../states/useRenderer"
import { getEncoding } from "../../states/useEncoding"
import { getPBR } from "../../states/usePBR"
import { getViewportSize } from "../../states/useViewportSize"
import { getSecondaryCamera } from "../../states/useSecondaryCamera"
import { VRButton } from "./VRButton"

export const rootContainer = document.createElement("div")
Object.assign(rootContainer.style, {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "100%",
    height: "100%"
})

export const container = document.createElement("div")
Object.assign(container.style, {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "100%",
    zIndex: "10"
})
rootContainer.appendChild(container)
getSecondaryCamera(cam => container.style.height = cam ? "50%" : "100%")

export const containerBounds = [container.getBoundingClientRect()]
const resizeObserver = new ResizeObserver(() => containerBounds[0] = container.getBoundingClientRect())
resizeObserver.observe(container)

queueMicrotask(() => {
    if (!settings.autoMount || rootContainer.parentElement) return
    
    if (typeof settings.autoMount === "string") {
        const el = document.querySelector(settings.autoMount)
        if (!el) return

        el.appendChild(rootContainer)

        const resizeObserver = new ResizeObserver(() => {
            const res: [number, number] = [el.clientWidth, el.clientHeight]
            setResolution(res)
        })
        resizeObserver.observe(el)
        return
    }

    window.addEventListener("resize", () => {
        setResolution([window.innerWidth, window.innerHeight])
    })
    document.body.appendChild(rootContainer)
})

export const referenceOutline = document.createElement("div")
Object.assign(referenceOutline.style, {
    border: "1px solid blue",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    pointerEvents: "none"
})
container.appendChild(referenceOutline)

createEffect(() => {
    const [vw, vh] = getViewportSize() ?? getResolution()
    const [rx, ry] = getResolution()
    referenceOutline.style.display = (getSecondaryCamera() || (rx === vw && ry === vh)) ? "none" : "block"
    
}, [getResolution, getViewportSize, getSecondaryCamera])

createEffect(() => {
    const canvas = getRenderer().domElement
    rootContainer.appendChild(canvas)
    Object.assign(canvas.style, { position: "absolute", left: "0px", top: "0px" })
    return () => {
        rootContainer.removeChild(canvas)
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