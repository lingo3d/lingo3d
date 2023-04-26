import store from "@lincode/reactivity"
import scene from "../engine/scene"
import { shadowModePtr } from "../pointers/shadowModePtr"
import { physicsSet } from "../collections/physicsSet"
import { addConfigCastShadowSystem } from "../systems/configLoadedSystems/configCastShadowSystem"

export const [setShadowMode, getShadowMode] = store<boolean | "physics">(true)

let first = true
getShadowMode((val) => {
    if (first) {
        first = false
        return
    }
    shadowModePtr[0] = val
    if (val === true)
        scene.traverse((child) => {
            if ("isMesh" in child) child.castShadow = child.receiveShadow
        })
    else if (val === "physics") {
        scene.traverse((child) => {
            if ("isMesh" in child) child.castShadow = false
        })
        for (const child of physicsSet) addConfigCastShadowSystem(child)
    } else
        scene.traverse((child) => {
            if ("isMesh" in child) child.castShadow = false
        })
})
