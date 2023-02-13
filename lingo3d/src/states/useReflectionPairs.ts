import store, { createEffect, pull, push } from "@lincode/reactivity"
import { CubeCamera, WebGLCubeRenderTarget } from "three"
import MeshAppendable from "../api/core/MeshAppendable"
import getWorldPosition from "../display/utils/getWorldPosition"
import scene from "../engine/scene"
import { onRenderHalfRate } from "../events/onRenderHalfRate"
import { getRenderer } from "./useRenderer"

const [setReflectionPairs, getReflectionPairs] = store<
    Array<[MeshAppendable, CubeCamera, WebGLCubeRenderTarget]>
>([])

export const pushReflectionPairs = push(setReflectionPairs, getReflectionPairs)
export const pullReflectionPairs = pull(setReflectionPairs, getReflectionPairs)

export const reflectionVisibleSet = new Set<MeshAppendable>()

createEffect(() => {
    const renderer = getRenderer()
    const pairs = getReflectionPairs()
    if (!renderer || !pairs.length) return

    const handle = onRenderHalfRate(() => {
        for (const manager of reflectionVisibleSet)
            manager.outerObject3d.visible = true
        for (const [manager] of pairs) manager.outerObject3d.visible = false
        for (const [manager, cubeCamera, cubeRenderTarget] of pairs) {
            cubeCamera.position.copy(getWorldPosition(manager.outerObject3d))
            cubeRenderTarget.clear(renderer, false, true, false)
            cubeCamera.update(renderer, scene)
        }
        for (const [manager] of pairs) manager.outerObject3d.visible = true
        for (const manager of reflectionVisibleSet)
            manager.outerObject3d.visible = false
    })
    return () => {
        handle.cancel()
    }
}, [getRenderer, getReflectionPairs])
