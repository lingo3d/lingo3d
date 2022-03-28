import { createEffect } from "@lincode/reactivity"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { getPixelRatio } from "../../../../states/usePixelRatio"
import { getRenderer } from "../../../../states/useRenderer"
import { getResolution } from "../../../../states/useResolution"
import renderPass from "../../effectComposer/renderPass"
import bloomPass from "../bloomPass"

const selectiveBloomComposer = new EffectComposer(getRenderer())
selectiveBloomComposer.renderToScreen = false
export default selectiveBloomComposer

createEffect(() => {
    selectiveBloomComposer.renderer = getRenderer()
    const [w, h] = getResolution()
    selectiveBloomComposer.setSize(w, h)
    selectiveBloomComposer.setPixelRatio(getPixelRatio())

}, [getRenderer, getResolution, getPixelRatio])

selectiveBloomComposer.addPass(renderPass)
selectiveBloomComposer.addPass(bloomPass)