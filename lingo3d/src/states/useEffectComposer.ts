import store, { createEffect } from "@lincode/reactivity"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { getRenderer } from "./useRenderer"
import { getResolution } from "./useResolution"
import { getPixelRatioComputed } from "./usePixelRatioComputed"

const [setEffectComposer, getEffectComposer] = store<EffectComposer | undefined>(undefined)
export { getEffectComposer }

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer) return

    setEffectComposer(new EffectComposer(renderer))

}, [getRenderer])


createEffect(() => {
    const effectComposer = getEffectComposer()
    if (!effectComposer) return

    const [w, h] = getResolution()
    effectComposer.setSize(w, h)
    effectComposer.setPixelRatio(getPixelRatioComputed())

}, [getEffectComposer, getResolution, getPixelRatioComputed])