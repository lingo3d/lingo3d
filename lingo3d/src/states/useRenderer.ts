import store, { createEffect } from "@lincode/reactivity"
import { PCFSoftShadowMap, WebGLRenderer } from "three"
import { getBackgroundColor } from "./useBackgroundColor"
import { rendererPtr } from "../pointers/rendererPtr"

const [setRenderer, getRenderer] = store<WebGLRenderer | undefined>(undefined)
export { getRenderer }

createEffect(() => {
    const renderer = new WebGLRenderer({
        powerPreference: "high-performance",
        // precision: "lowp",
        // antialias: false,
        // stencil: false,
        // depth: false,
        alpha: getBackgroundColor() === "transparent"
    })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = PCFSoftShadowMap
    setRenderer((rendererPtr[0] = renderer))

    return () => {
        renderer.dispose()
    }
}, [getBackgroundColor])
