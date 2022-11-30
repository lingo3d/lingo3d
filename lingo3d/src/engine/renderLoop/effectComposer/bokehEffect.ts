import store, { createEffect } from "@lincode/reactivity"
import { DepthOfFieldEffect } from "postprocessing"
import { getBokeh } from "../../../states/useBokeh"
import { getBokehScale } from "../../../states/useBokehScale"
import { getCameraRendered } from "../../../states/useCameraRendered"

const [setBokehEffect, getBokehEffect] = store<DepthOfFieldEffect | undefined>(
    undefined
)
export { getBokehEffect }

createEffect(() => {
    if (!getBokeh()) return

    const effect = new DepthOfFieldEffect(getCameraRendered(), {
        focusDistance: 0.0,
        focalLength: 0.048,
        bokehScale: getBokehScale(),
        height: 480
    })
    setBokehEffect(effect)

    const handle = getBokehScale((val) => (effect.bokehScale = val))

    return () => {
        handle.cancel()
        setBokehEffect(undefined)
        effect.dispose()
    }
}, [getBokeh, getCameraRendered])
