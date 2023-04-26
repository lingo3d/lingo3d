import store from "@lincode/reactivity"
import scene from "../engine/scene"
import { shadowModePtr } from "../pointers/shadowModePtr"

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
        //mark
    } else
        scene.traverse((child) => {
            if ("isMesh" in child) child.castShadow = false
        })
})
