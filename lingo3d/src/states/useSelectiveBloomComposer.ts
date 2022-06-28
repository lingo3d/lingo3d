import store, { createEffect } from "@lincode/reactivity"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { getRenderer } from "./useRenderer"
import { getResolution } from "./useResolution"

const [setSelectiveBloomComposer, getSelectiveBloomComposer] = store<EffectComposer | undefined>(undefined)
export { getSelectiveBloomComposer }

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer) return

    const selectiveBloomComposer = new EffectComposer(renderer)
    selectiveBloomComposer.renderToScreen = false
    setSelectiveBloomComposer(selectiveBloomComposer)

}, [getRenderer])

createEffect(() => {
    const selectiveBloomComposer = getSelectiveBloomComposer()
    if (!selectiveBloomComposer) return

    const [w, h] = getResolution()
    selectiveBloomComposer.setSize(w, h)
    selectiveBloomComposer.setPixelRatio(1)

}, [getSelectiveBloomComposer, getResolution])