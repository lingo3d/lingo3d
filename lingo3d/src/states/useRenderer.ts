import store, { createEffect } from "@lincode/reactivity"
import { WebGLRenderer } from "three"
import isChromium from "../api/utils/isChromium"
import { getAntiAlias } from "./useAntiAlias"
import { getBackgroundColor } from "./useBackgroundColor"
import { getEffectComposerPassCount } from "./useEffectComposerPassCount"
import { getLogarithmicDepth } from "./useLogarithmicDepth"
import { getMobile } from "./useMobile"

const [setRenderer, getRenderer] = store<WebGLRenderer | undefined>(undefined)
export { getRenderer }

createEffect(() => {
    const renderer = new WebGLRenderer({
        powerPreference: "high-performance",
        alpha: getBackgroundColor() === "transparent",
        logarithmicDepthBuffer: isChromium && !getMobile() ? getLogarithmicDepth() : false,
        antialias: !!(!getEffectComposerPassCount() && getAntiAlias())
    })
    setRenderer(renderer)
    
    return () => {
        renderer.dispose()
    }
}, [getBackgroundColor, getLogarithmicDepth, getMobile, getAntiAlias, getEffectComposerPassCount])