import store, { createEffect } from "@lincode/reactivity"
import { WebGLRenderer } from "three"
import isChromium from "../api/utils/isChromium"
import isMobile from "../api/utils/isMobile"
import { getAntiAlias } from "./useAntiAlias"
import { getBackgroundColor } from "./useBackgroundColor"
import { getEffectComposerPassCount } from "./useEffectComposerPassCount"
import { getLogarithmicDepth } from "./useLogarithmicDepth"

const [setRenderer, getRenderer] = store<WebGLRenderer | undefined>(undefined)
export { getRenderer }

createEffect(() => {
    const renderer = new WebGLRenderer({
        powerPreference: "high-performance",
        alpha: getBackgroundColor() === "transparent",
        logarithmicDepthBuffer: isChromium && !isMobile ? getLogarithmicDepth() : false,
        antialias: !!(!getEffectComposerPassCount() && getAntiAlias())
    })
    setRenderer(renderer)
    
    return () => {
        renderer.dispose()
    }
}, [getBackgroundColor, getLogarithmicDepth, getAntiAlias, getEffectComposerPassCount])