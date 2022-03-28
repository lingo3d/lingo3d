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

const [setRenderer, getRenderer] = store(makeRenderer())
export { getRenderer }

createEffect(() => {
    getRenderer().dispose()
    setRenderer(makeRenderer())

}, [getBackgroundColor, getLogarithmicDepth])