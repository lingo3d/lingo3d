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
import smaaPass from "./smaaPass"
import lensDistortionPass from "./lensDistortionPass"
import { getLensDistortion } from "../../../states/useLensDistortion"
import isSafari from "../../../api/utils/isSafari"
import { WebGLRenderTarget } from "three"
import { WIDTH, HEIGHT } from "../../../globals"

const effectComposer = (() => {
    if (isSafari)
        return new EffectComposer(getRenderer())

    //@ts-ignore
    const msaaRenderTarget = new WebGLRenderTarget(WIDTH, HEIGHT, { samples: 4 })
    getResolution(([w, h]) => msaaRenderTarget.setSize(w, h))
    return new EffectComposer(getRenderer(), msaaRenderTarget)
})()
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

    if (getLensDistortion())
        passes.push(lensDistortionPass)

    isSafari && passes.push(smaaPass)

    for (const pass of passes)
        effectComposer.addPass(pass)

    return () => {
        for (const pass of passes)
            effectComposer.removePass(pass)
    }
}, [getSSR, getAmbientOcclusion, getBloom, getSelectiveBloom, getBokeh, getOutline, getLensDistortion])