import store, { createEffect } from "@lincode/reactivity"
import { WebGLRenderer } from "three"
import isChromium from "../api/utils/isChromium"
import { getBackgroundColor } from "./useBackgroundColor"
import { getLogarithmicDepth } from "./useLogarithmicDepth"
import { getMobile } from "./useMobile"

const makeRenderer = () => new WebGLRenderer({
    powerPreference: "high-performance",
    alpha: getBackgroundColor() === "transparent",
    logarithmicDepthBuffer: isChromium && !getMobile() ? getLogarithmicDepth() : false,
    antialias: true
})

let firstRenderer: WebGLRenderer | undefined

const [setRenderer, getRenderer] = store(firstRenderer = makeRenderer())
export { getRenderer }

createEffect(() => {
    const renderer = firstRenderer ?? makeRenderer()
    setRenderer(renderer)
    return () => {
        renderer.dispose()
        firstRenderer = undefined
    }
}, [getBackgroundColor, getLogarithmicDepth, getMobile])