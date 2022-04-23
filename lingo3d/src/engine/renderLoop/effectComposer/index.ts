import { createEffect } from "@lincode/reactivity"
import { EffectComposer, Pass } from "three/examples/jsm/postprocessing/EffectComposer"
import { getBloom } from "../../../states/useBloom"
import { getBokeh } from "../../../states/useBokeh"
import { getAmbientOcclusion } from "../../../states/useAmbientOcclusion"
import { getResolution } from "../../../states/useResolution"
import { getSelectiveBloom } from "../../../states/useSelectiveBloom"
import bloomPass from "./bloomPass"
import bokehPass from "./bokehPass"
import renderPass from "./renderPass"
import selectiveBloomPass from "./selectiveBloomPass"
import saoPass from "./saoPass"
import ssrPass from "./ssrPass"
import { getSSR } from "../../../states/useSSR"
import { getRenderer } from "../../../states/useRenderer"
import { getPixelRatio } from "../../../states/usePixelRatio"
import outlinePass from "./outlinePass"
import { getOutline } from "../../../states/useOutline"
import { WebGLRenderTarget } from "three"
import { HEIGHT, WIDTH } from "../../../globals"

//@ts-ignore
const renderTarget = new WebGLRenderTarget(WIDTH, HEIGHT, { samples: 8 })
getResolution(([w, h]) => renderTarget.setSize(w, h))

const effectComposer = new EffectComposer(getRenderer(), renderTarget)
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

    if (getOutline())
        passes.push(outlinePass)

    for (const pass of passes)
        effectComposer.addPass(pass)

    return () => {
        for (const pass of passes)
            effectComposer.removePass(pass)
    }
}, [getSSR, getAmbientOcclusion, getBloom, getSelectiveBloom, getBokeh, getOutline])