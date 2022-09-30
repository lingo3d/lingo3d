import store, { createEffect } from "@lincode/reactivity"
import { BloomEffect } from "postprocessing"
import { getBloom } from "../../../states/useBloom"
import { getBloomStrength } from "../../../states/useBloomStrength"
import { getBloomThreshold } from "../../../states/useBloomThreshold"

const [setBloomEffect, getBloomEffect] = store<BloomEffect | undefined>(
    undefined
)
export { getBloomEffect }

createEffect(() => {
    if (!getBloom()) return

    const effect = new BloomEffect({
        luminanceThreshold: getBloomThreshold()
    })
    setBloomEffect(effect)
    const handle = getBloomStrength((val) => (effect.intensity = val))

    return () => {
        setBloomEffect(undefined)
        effect.dispose()
        handle.cancel()
    }
}, [getBloom, getBloomThreshold])
