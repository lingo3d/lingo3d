import store, { createEffect } from "@lincode/reactivity"
import { getCameraRendered } from "../../../../states/useCameraRendered"
import { getSSR } from "../../../../states/useSSR"
import { getSSRIntensity } from "../../../../states/useSSRIntensity"
import scene from "../../../scene"
import cacheEffect from "../cacheEffect"
import { SSREffect } from "./SSREffect"

const [setSSREffect, getSSREffect] = store<SSREffect | undefined>(undefined)
export { getSSREffect }

createEffect(() => {
    if (!getSSR()) return

    const effect = cacheEffect(
        getCameraRendered(),
        (camera) => new SSREffect(scene, camera)
    )
    setSSREffect(effect)
    const handle = getSSRIntensity(
        //@ts-ignore
        (val) => (effect.intensity = val)
    )
    return () => {
        setSSREffect(undefined)
        handle.cancel()
    }
}, [getSSR, getCameraRendered])
