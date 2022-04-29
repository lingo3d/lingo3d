import { createEffect } from "@lincode/reactivity"
import { Fog } from "three"
import scene from "./scene"
import { getDefaultFog } from "../../states/useDefaultFog"

export default {}

createEffect(() => {
    const defaultFog = getDefaultFog()
    if (!defaultFog) return

    scene.fog = new Fog(defaultFog, 0, 100)

    return () => {
        scene.fog = null
    }
}, [getDefaultFog])
