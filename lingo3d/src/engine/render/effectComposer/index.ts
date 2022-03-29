import { createEffect } from "@lincode/reactivity"
import { EffectComposer, Pass } from "three/examples/jsm/postprocessing/EffectComposer"
import { getBloom } from "../../../states/useBloom"
import { getBokeh } from "../../../states/useBokeh"
import { getAmbientOcclusion } from "../../../states/useAmbientOcclusion"
import { getResolution } from "../../../states/useResolution"
import { getSelectiveBloom } from "../../../states/useSelectiveBloom"
import bloomPass from "./bloomPass"
import bokehPass from "./bokehPass"
import fxaaPass from "./fxaaPass"
import renderPass from "./renderPass"
import selectiveBloomPass from "./selectiveBloomPass"
import saoPass from "./saoPass"
import ssrPass from "./ssrPass"
import { getSSR } from "../../../states/useSSR"
import { getRenderer } from "../../../states/useRenderer"
import { getPixelRatio } from "../../../states/usePixelRatio"

const effectComposer = new EffectComposer(getRenderer())
export default effectComposer

createEffect(() => {
    effectComposer.renderer = getRenderer()
    const [w, h] = getResolution()
    effectComposer.setSize(w, h)
    effectComposer.setPixelRatio(getPixelRatio())

}, [getRenderer, getResolution, getPixelRatio])


createEffect(() => {
    const passes: Array<Pass> = [renderPass]

    if (getSSR())
        passes.push(ssrPass)

    if (getAmbientOcclusion())
        passes.push(saoPass)

    if (getBloom())
        passes.push(bloomPass)

    if (getSelectiveBloom())
        passes.push(selectiveBloomPass)

    if (getBokeh())
        passes.push(bokehPass)

    passes.push(fxaaPass)

    for (const pass of passes)
        effectComposer.addPass(pass)

    return () => {
        for (const pass of passes)
            effectComposer.removePass(pass)
    }
}, [getSSR, getAmbientOcclusion, getBloom, getSelectiveBloom, getBokeh])