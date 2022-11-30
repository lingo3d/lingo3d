import store, { createEffect } from "@lincode/reactivity"
import { PCFSoftShadowMap, WebGLRenderer } from "three"
import isChromium from "../api/utils/isChromium"
import isMobile from "../api/utils/isMobile"
import { getBackgroundColor } from "./useBackgroundColor"
import { getLogarithmicDepth } from "./useLogarithmicDepth"

const [setRenderer, getRenderer] = store<WebGLRenderer | undefined>(undefined)
export { getRenderer }

createEffect(() => {
    const renderer = new WebGLRenderer({
        powerPreference: "high-performance",
        alpha: getBackgroundColor() === "transparent",
        logarithmicDepthBuffer:
            isChromium && !isMobile ? getLogarithmicDepth() : false
    })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = PCFSoftShadowMap
    setRenderer(renderer)

    return () => {
        renderer.dispose()
    }
}, [getBackgroundColor, getLogarithmicDepth])
