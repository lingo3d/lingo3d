import store, { createEffect, pull, push } from "@lincode/reactivity"
import { CubeCamera } from "three"
import MeshAppendable from "../api/core/MeshAppendable"
import getWorldPosition from "../display/utils/getWorldPosition"
import scene from "../engine/scene"
import { onRenderHalfRate } from "../events/onRenderHalfRate"
import { getRenderer } from "./useRenderer"

const [setReflectionPairs, getReflectionPairs] = store<
    Array<[MeshAppendable, CubeCamera]>
>([])

export const pushReflectionPairs = push(setReflectionPairs, getReflectionPairs)
export const pullReflectionPairs = pull(setReflectionPairs, getReflectionPairs)

createEffect(() => {
    const renderer = getRenderer()
    const pairs = getReflectionPairs()
    if (!renderer || !pairs.length) return

    const handle = onRenderHalfRate(() => {
        for (const [manager] of pairs) manager.outerObject3d.visible = false
        for (const [manager, cubeCamera] of pairs) {
            cubeCamera.position.copy(getWorldPosition(manager.outerObject3d))
            cubeCamera.update(renderer, scene)
        }
        for (const [manager] of pairs) manager.outerObject3d.visible = true
    })
    return () => {
        handle.cancel()
    }
}, [getRenderer, getReflectionPairs])
