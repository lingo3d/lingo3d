import { LinearToneMapping, NoToneMapping } from "three"
import { getExposure } from "../../states/useExposure"
import { getResolution, setResolution } from "../../states/useResolution"
import { createEffect, createNestedEffect } from "@lincode/reactivity"
import { getWebXR } from "../../states/useWebXR"
import { getRenderer } from "../../states/useRenderer"
import { getPBR } from "../../states/usePBR"
import { VRButton } from "./VRButton"
import { getAutoMount } from "../../states/useAutoMount"
import { debounceTrailing } from "@lincode/utils"
import { getPixelRatio } from "../../states/usePixelRatio"
import createElement from "../../utils/createElement"
import { getUILayer } from "../../states/useUILayer"
import { getSplitView } from "../../states/useSplitView"
import { getTimelinePaused } from "../../states/useTimelinePaused"

const style = createElement(`
    <style>
        .lingo3d-container {
            position: absolute !important;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
        }
        .lingo3d-uicontainer {
            pointer-events: none;
        }
        .lingo3d-uicontainer > * {
            pointer-events: auto;
        }
    </style>
`)
document.head.appendChild(style)

export const container = createElement<HTMLDivElement>(
    `<div class="lingo3d-container"></div>`
)
export const uiContainer = createElement<HTMLDivElement>(
    `<div class="lingo3d-container lingo3d-uicontainer"></div>`
)
export const overlayContainer = createElement<HTMLDivElement>(
    `<div class="lingo3d-container lingo3d-uicontainer"></div>`
)
container.appendChild(uiContainer)
container.appendChild(overlayContainer)
getSplitView((val) => {
    container.style.height = val ? "50%" : "100%"
    uiContainer.style.top = val ? "100%" : "0px"
})
createEffect(() => {
    uiContainer.style.display =
        getUILayer() || !getTimelinePaused() ? "block" : "none"
}, [getUILayer, getTimelinePaused])

export const containerBounds = [container.getBoundingClientRect()]

const useResize = (el: Element) => {
    createNestedEffect(() => {
        const handleResize = () => {
            containerBounds[0] = container.getBoundingClientRect()
            setResolution(
                el === document.body
                    ? [window.innerWidth, window.innerHeight]
                    : [el.clientWidth, el.clientHeight]
            )
        }
        handleResize()

        const resizeObserver = new ResizeObserver(
            debounceTrailing(handleResize, 100)
        )
        resizeObserver.observe(container)

        return () => {
            resizeObserver.disconnect()
        }
    }, [el])
}

createEffect(() => {
    const autoMount = getAutoMount()
    if (!autoMount) return

    if (typeof autoMount === "string") {
        const el = document.querySelector(autoMount)
        if (!el) return

        el.prepend(container)
        useResize(el)

        return () => {
            container.remove()
        }
    }

    if (autoMount === true) {
        document.body.prepend(container)
        useResize(document.body)

        return () => {
            container.remove()
        }
    }

    autoMount.prepend(container)
    useResize(autoMount)

    return () => {
        container.remove()
    }
}, [getAutoMount])

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer) return

    const canvas = renderer.domElement
    container.prepend(canvas)
    canvas.classList.add("lingo3d-container")
    return () => {
        canvas.remove()
    }
}, [getRenderer])

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer) return

    const [w, h] = getResolution()
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(getPixelRatio(), devicePixelRatio))
}, [getRenderer, getResolution, getPixelRatio])

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer) return

    renderer.physicallyCorrectLights = getPBR()
}, [getRenderer, getPBR])

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer) return

    const exposure = getExposure()
    renderer.toneMapping = exposure !== 1 ? LinearToneMapping : NoToneMapping
    renderer.toneMappingExposure = exposure
}, [getExposure, getRenderer])

createEffect(() => {
    if (!getWebXR()) return

    const renderer = getRenderer()
    if (!renderer) return

    renderer.xr.enabled = true

    const button = VRButton.createButton(renderer)
    uiContainer.appendChild(button)

    button.ontouchstart = () => button.onclick?.(new MouseEvent("click"))

    return () => {
        renderer.xr.enabled = false
        button.remove()
    }
}, [getWebXR, getRenderer])
