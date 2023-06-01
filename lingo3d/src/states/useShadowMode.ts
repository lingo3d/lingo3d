import store from "@lincode/reactivity"
import scene from "../engine/scene"
import { shadowModePtr } from "../pointers/shadowModePtr"
import { physicsSet } from "../collections/physicsSet"
import { Object3D } from "three"
import isOpaque from "../memo/isOpaque"
import { configCastShadowSystem } from "../systems/configLoadedSystems/configCastShadowSystem"

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
            if (child.type === "Mesh")
                child.castShadow = child.receiveShadow && isOpaque(child)
        })
    else if (val === "physics") {
        scene.traverse((child) => {
            if (child.type === "Mesh") child.castShadow = false
        })
        for (const child of physicsSet) configCastShadowSystem.add(child)
    } else
        scene.traverse((child) => {
            if (child.type === "Mesh") child.castShadow = false
        })
})

const clone = Object3D.prototype.clone
getShadowMode((val) => {
    if (val === true)
        Object3D.prototype.clone = function (recursive) {
            const result = clone.call(this, recursive)
            result.castShadow = result.receiveShadow
            return result
        }
    else Object3D.prototype.clone = clone
})
