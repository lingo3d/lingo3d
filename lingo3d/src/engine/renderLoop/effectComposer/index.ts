import { createEffect } from "@lincode/reactivity"
import { Pass } from "three/examples/jsm/postprocessing/EffectComposer"
import { getBloom } from "../../../states/useBloom"
import { getBokeh } from "../../../states/useBokeh"
import { getAmbientOcclusion } from "../../../states/useAmbientOcclusion"
import { getSelectiveBloom } from "../../../states/useSelectiveBloom"
import bloomPass from "./bloomPass"
import bokehPass from "./bokehPass"
import renderPass from "./renderPass"
import selectiveBloomPass from "./selectiveBloomPass"
import saoPass from "./saoPass"
import ssrPass from "./ssrPass"
import { getSSR } from "../../../states/useSSR"
import outlinePass from "./outlinePass"
import { getOutline } from "../../../states/useOutline"
import lensDistortionPass from "./lensDistortionPass"
import { getLensDistortion } from "../../../states/useLensDistortion"
import { getEffectComposer } from "../../../states/useEffectComposer"
import { getAntiAlias } from "../../../states/useAntiAlias"
import smaaPass from "./smaaPass"
import motionBlurPass from "./motionBlurPass"
import { getMotionBlur } from "../../../states/useMotionBlur"

export default {}

createEffect(() => {
    const effectComposer = getEffectComposer()
    if (!effectComposer) return

    const passes: Array<Pass> = [renderPass]

    if (getSSR()) passes.push(ssrPass)

    if (getAmbientOcclusion()) passes.push(saoPass)

    if (getBloom()) passes.push(bloomPass)

    if (getSelectiveBloom()) passes.push(selectiveBloomPass)

    if (getBokeh()) passes.push(bokehPass)

    if (getOutline()) passes.push(outlinePass)

    if (getLensDistortion()) passes.push(lensDistortionPass)

    if (getAntiAlias() === "SSAA" || getAntiAlias() === "SMAA")
        passes.push(smaaPass)

    if (getMotionBlur()) for (const pass of motionBlurPass) passes.push(pass)

    for (const pass of passes) effectComposer.addPass(pass)

    return () => {
        for (const pass of passes) effectComposer.removePass(pass)
    }
}, [
    getEffectComposer,
    getSSR,
    getAmbientOcclusion,
    getBloom,
    getSelectiveBloom,
    getBokeh,
    getOutline,
    getLensDistortion,
    getAntiAlias,
    getMotionBlur
])
