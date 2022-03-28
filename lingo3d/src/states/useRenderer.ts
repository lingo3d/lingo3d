import store, { createEffect } from "@lincode/reactivity"
import { WebGLRenderer } from "three"
import { getBackgroundColor } from "./useBackgroundColor"
import { getLogarithmicDepth } from "./useLogarithmicDepth"

const makeRenderer = () => new WebGLRenderer({
    powerPreference: "high-performance",
    alpha: getBackgroundColor() === "transparent",
    logarithmicDepthBuffer: getLogarithmicDepth(),
    antialias: true
})

const defaultRenderer = makeRenderer()
queueMicrotask(() => defaultRenderer.dispose())

const [setRenderer, getRenderer] = store(defaultRenderer)
export { getRenderer }

createEffect(() => {
    const renderer = makeRenderer()
    setRenderer(renderer)
    return () => {
        renderer.dispose()
    }
}, [getBackgroundColor, getLogarithmicDepth])