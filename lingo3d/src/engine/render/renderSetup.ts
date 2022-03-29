import { ACESFilmicToneMapping, NoToneMapping, PCFSoftShadowMap } from "three"
import { getExposure } from "../../states/useExposure"
import ResizeObserver from "resize-observer-polyfill"
import { getResolution } from "../../states/useResolution"
import { getToneMapping } from "../../states/useToneMapping"
import { getPerformance } from "../../states/usePerformance"
import { getPixelRatio } from "../../states/usePixelRatio"
import { VRButton } from "three/examples/jsm/webxr/VRButton"
import { createEffect } from "@lincode/reactivity"
import { getVR } from "../../states/useVR"
import settings from "../../api/settings"
import { getRenderer } from "../../states/useRenderer"

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
    if (!settings.autoMout || container.parentElement) return
    document.body.appendChild(container)
    settings.fillWindow = true
})

export const outline = document.createElement("div")
Object.assign(outline.style, {
    border: "1px solid blue",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translateX(-50%) translateY(-50%)"
})

createEffect(() => {
    const canvas = getRenderer().domElement
    container.appendChild(canvas)
    container.appendChild(outline)
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
    
    renderer.toneMapping = getToneMapping() ? ACESFilmicToneMapping : NoToneMapping
    renderer.toneMappingExposure = getExposure()
    renderer.shadowMap.enabled = getPerformance() !== "speed"

    // renderer.physicallyCorrectLights = true
    // renderer.outputEncoding = sRGBEncoding
    // renderer.shadowMap.type = PCFSoftShadowMap

}, [getRenderer, getResolution, getPixelRatio, getToneMapping, getExposure, getPerformance])

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