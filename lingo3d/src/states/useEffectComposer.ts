import store, { createEffect } from "@lincode/reactivity"
import { WebGLRenderTarget } from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { WIDTH, HEIGHT } from "../globals"
import { getRenderer } from "./useRenderer"
import { getResolution } from "./useResolution"
import { getAntiAlias } from "./useAntiAlias"
import { getPixelRatioComputed } from "./usePixelRatioComputed"

const [setEffectComposer, getEffectComposer] = store<EffectComposer | undefined>(undefined)
export { getEffectComposer }

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer) return

    if (getAntiAlias() !== "MSAA") {
        setEffectComposer(new EffectComposer(renderer))
        return
    }
    
    //@ts-ignore
    const msaaRenderTarget = new WebGLRenderTarget(WIDTH, HEIGHT, { samples: 4 })
    const handle = getResolution(([w, h]) => msaaRenderTarget.setSize(w, h))
    setEffectComposer(new EffectComposer(renderer, msaaRenderTarget))

    return () => {
        msaaRenderTarget.dispose()
        handle.cancel()
    }
}, [getRenderer, getAntiAlias])


createEffect(() => {
    const effectComposer = getEffectComposer()
    if (!effectComposer) return

    const [w, h] = getResolution()
    effectComposer.setSize(w, h)
    effectComposer.setPixelRatio(getPixelRatioComputed())

}, [getEffectComposer, getResolution, getPixelRatioComputed])