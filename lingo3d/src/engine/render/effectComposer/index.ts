import { createEffect } from "@lincode/reactivity"
import { EffectComposer, Pass } from "three/examples/jsm/postprocessing/EffectComposer"
import { getBloom } from "../../../states/useBloom"
import { getBokeh } from "../../../states/useBokeh"
import { getAmbientOcclusion } from "../../../states/useAmbientOcclusion"
import { getResolution } from "../../../states/useResolution"
import { getSelectiveBloom } from "../../../states/useSelectiveBloom"
import { renderer } from "../renderer"
import bloomPass from "./bloomPass"
import bokehPass from "./bokehPass"
import fxaaPass from "./fxaaPass"
import renderPass from "./renderPass"
import selectiveBloomPass from "./selectiveBloomPass"
import saoPass from "./saoPass"
import ssrPass from "./ssrPass"
import { getSSR } from "../../../states/useSSR"

const effectComposer = new EffectComposer(renderer)
getResolution(([w, h]) => effectComposer.setSize(w, h))
export default effectComposer

createEffect(() => {
    const passes: Array<Pass> = [renderPass]

    passes.push(fxaaPass)

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

    for (const pass of passes)
        effectComposer.addPass(pass)

    return () => {
        for (const pass of passes)
            effectComposer.removePass(pass)
    }
}, [getSSR, getAmbientOcclusion, getBloom, getSelectiveBloom, getBokeh])