import { createEffect } from "@lincode/reactivity"
import { Pass } from "three/examples/jsm/postprocessing/EffectComposer"
import { getBloom } from "../../../states/useBloom"
import { getAmbientOcclusion } from "../../../states/useAmbientOcclusion"
import { getSelectiveBloom } from "../../../states/useSelectiveBloom"
import bloomPass from "./bloomPass"
import renderPass from "./renderPass"
import selectiveBloomPass from "./selectiveBloomPass"
import saoPass from "./saoPass"
import { getSSRPass } from "./ssrPass"
import outlinePass from "./outlinePass"
import { getOutline } from "../../../states/useOutline"
import lensDistortionPass from "./lensDistortionPass"
import { getLensDistortion } from "../../../states/useLensDistortion"
import { getEffectComposer } from "../../../states/useEffectComposer"
import { getAntiAlias } from "../../../states/useAntiAlias"
import smaaPass from "./smaaPass"
import motionBlurPass from "./motionBlurPass"
import { getMotionBlur } from "../../../states/useMotionBlur"
import { getBokehPass } from "./bokehPass"

export default {}

createEffect(() => {
    const effectComposer = getEffectComposer()
    if (!effectComposer) return

    const passes: Array<Pass> = []

    const ssrPass = getSSRPass()
    if (ssrPass) passes.push(ssrPass)
    else passes.push(renderPass)

    if (getAmbientOcclusion()) passes.push(saoPass)

    if (getBloom()) passes.push(bloomPass)

    if (getSelectiveBloom()) passes.push(selectiveBloomPass)

    const bokehPass = getBokehPass()
    if (bokehPass) passes.push(bokehPass)

    if (getOutline()) passes.push(outlinePass)

    if (getLensDistortion()) passes.push(lensDistortionPass)

    const antiAlias = getAntiAlias()
    if (antiAlias === "SSAA" || antiAlias === "SMAA") passes.push(smaaPass)

    if (getMotionBlur()) for (const pass of motionBlurPass) passes.push(pass)

    for (const pass of passes) effectComposer.addPass(pass)

    return () => {
        for (const pass of passes) effectComposer.removePass(pass)
    }
}, [
    getEffectComposer,
    getSSRPass,
    getAmbientOcclusion,
    getBloom,
    getSelectiveBloom,
    getBokehPass,
    getOutline,
    getLensDistortion,
    getAntiAlias,
    getMotionBlur
])
