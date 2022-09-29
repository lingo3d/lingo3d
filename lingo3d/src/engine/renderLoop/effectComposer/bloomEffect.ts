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

    const bloomEffect = new BloomEffect({
        luminanceThreshold: getBloomThreshold()
    })
    setBloomEffect(bloomEffect)
    const handle = getBloomStrength((val) => (bloomEffect.intensity = val))

    return () => {
        setBloomEffect(undefined)
        bloomEffect.dispose()
        handle.cancel()
    }
}, [getBloom, getBloomThreshold])
