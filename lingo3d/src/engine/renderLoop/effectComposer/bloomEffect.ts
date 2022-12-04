import store, { createEffect } from "@lincode/reactivity"
import { BlendFunction, BloomEffect } from "postprocessing"
import { getBloom } from "../../../states/useBloom"
import { getBloomRadius } from "../../../states/useBloomRadius"
import { getBloomIntensity } from "../../../states/useBloomIntensity"
import { getBloomThreshold } from "../../../states/useBloomThreshold"
import unsafeGetValue from "../../../utils/unsafeGetValue"

const [setBloomEffect, getBloomEffect] = store<BloomEffect | undefined>(
    undefined
)
export { getBloomEffect }

createEffect(() => {
    if (!getBloom()) return

    const effect = new BloomEffect({
        blendFunction: BlendFunction.ADD,
        mipmapBlur: true,
        luminanceSmoothing: 0.3
    })
    setBloomEffect(effect)

    const handle0 = getBloomIntensity((val) => (effect.intensity = val))
    const handle1 = getBloomThreshold(
        (val) => (effect.luminanceMaterial.threshold = val)
    )
    const handle2 = getBloomRadius(
        (val) =>
            (unsafeGetValue(effect, "mipmapBlurPass").radius = Math.min(
                val,
                0.9
            ))
    )
    return () => {
        setBloomEffect(undefined)
        effect.dispose()
        handle0.cancel()
        handle1.cancel()
        handle2.cancel()
    }
}, [getBloom])
