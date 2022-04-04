import { createEffect } from "@lincode/reactivity"
import { Fog } from "three"
import scene from "./scene"
import { getDefaultFog } from "../../states/useDefaultFog"

createEffect(() => {
    if (!getDefaultFog()) return

    scene.fog = new Fog(0x000000, 0, 100)

    return () => {
        scene.fog = null
    }
}, [getDefaultFog])
