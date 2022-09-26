import { createEffect } from "@lincode/reactivity"
import { Pass } from "three/examples/jsm/postprocessing/EffectComposer"
import { getBloom } from "../../../states/useBloom"
import { getSelectiveBloom } from "../../../states/useSelectiveBloom"
import bloomPass from "./bloomPass"
import renderPass from "./renderPass"
import selectiveBloomPass from "./selectiveBloomPass"
import lensDistortionPass from "./lensDistortionPass"
import { getLensDistortion } from "../../../states/useLensDistortion"
import { getEffectComposer } from "../../../states/useEffectComposer"
import motionBlurPass from "./motionBlurPass"
import { getMotionBlur } from "../../../states/useMotionBlur"
import { getAmbientOcclusion } from "../../../states/useAmbientOcclusion"
import saoPass from "./saoPass"
import { getBokeh } from "../../../states/useBokeh"
import bokehPass from "./bokehPass"
import { getOutline } from "../../../states/useOutline"
import outlinePass from "./outlinePass"
import { getAntiAlias } from "../../../states/useAntiAlias"
import { getRenderer } from "../../../states/useRenderer"
import smaaPass from "./smaaPass"
import { getSSR } from "../../../states/useSSR"
import ssrPass from "./ssrPass"

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

    if (getMotionBlur()) for (const pass of motionBlurPass) passes.push(pass)

    const antiAlias = getAntiAlias()
    if (
        antiAlias === "SMAA" ||
        (antiAlias === "MSAA" && !getRenderer()?.capabilities.isWebGL2)
    )
        passes.push(smaaPass)

    for (const pass of passes) effectComposer.addPass(pass)

    return () => {
        for (const pass of passes) effectComposer.removePass(pass)
    }
}, [
    getEffectComposer,
    getAmbientOcclusion,
    getBloom,
    getSelectiveBloom,
    getBokeh,
    getOutline,
    getSSR,
    getLensDistortion,
    getMotionBlur,
    getAntiAlias,
    getRenderer
])
