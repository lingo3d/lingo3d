import { ACESFilmicToneMapping, NoToneMapping, PCFSoftShadowMap, WebGLRenderer } from "three"
import { getExposure } from "../../states/useExposure"
import ResizeObserver from "resize-observer-polyfill"
import { getResolution } from "../../states/useResolution"
import { getToneMapping } from "../../states/useToneMapping"
import { getPerformance } from "../../states/usePerformance"
import { getPixelRatio } from "../../states/usePixelRatio"

export const container = document.createElement("div")
// document.body.appendChild(container)
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

export const renderer = new WebGLRenderer({ powerPreference: "high-performance", alpha: true })
export const canvas = renderer.domElement

getResolution(([w, h]) => {
    renderer.setSize(w, h)
    Object.assign(canvas.style, { width: "100%", height: "100%" })
})
getToneMapping(val => renderer.toneMapping = val ? ACESFilmicToneMapping : NoToneMapping)
getExposure(val => renderer.toneMappingExposure = val)
getPerformance(val => renderer.shadowMap.enabled = val !== "speed")
getPixelRatio(val => renderer.setPixelRatio(val))

// renderer.physicallyCorrectLights = true
// renderer.outputEncoding = sRGBEncoding
// renderer.shadowMap.type = PCFSoftShadowMap

container.appendChild(canvas)
Object.assign(canvas.style, {
    position: "absolute",
    left: "0px",
    top: "0px"
})

export const outline = document.createElement("div")
container.appendChild(outline)
Object.assign(outline.style, {
    border: "1px solid blue",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translateX(-50%) translateY(-50%)"
})