import store from "@lincode/reactivity"
import scene from "../engine/scene"
import { getPhysicsObjectManager } from "../api/utils/getManager"

export const [setShadowMode, getShadowMode] = store<boolean | "physics">(true)

let first = true
getShadowMode((val) => {
    if (first) {
        first = false
        return
    }
    if (val === true)
        scene.traverse((child) => {
            if ("isMesh" in child) child.castShadow = child.receiveShadow
        })
    else if (val === "physics")
        scene.traverse((child) => {
            if ("isMesh" in child)
                child.castShadow =
                    child.receiveShadow &&
                    !!getPhysicsObjectManager(child)?.physics
        })
    else
        scene.traverse((child) => {
            if ("isMesh" in child) child.castShadow = false
        })
})
