import { CubeCamera, WebGLCubeRenderTarget } from "three"
import MeshAppendable from "../api/core/MeshAppendable"
import getWorldPosition from "../display/utils/getWorldPosition"
import scene from "../engine/scene"
import { onRenderHalfRate } from "../events/onRenderHalfRate"
import { rendererPtr } from "../states/useRenderer"
import renderSystemWithLifeCycleAndData from "./utils/renderSystemWithLifeCycleAndData"
import { reflectionVisibleSet } from "../collections/reflectionVisibleSet"

export const [addReflectionSystem, deleteReflectionSystem] =
    renderSystemWithLifeCycleAndData(
        (
            manager: MeshAppendable,
            data: {
                cubeCamera: CubeCamera
                cubeRenderTarget: WebGLCubeRenderTarget
            }
        ) => {
            data.cubeCamera.position.copy(
                getWorldPosition(manager.outerObject3d)
            )
            data.cubeRenderTarget.clear(rendererPtr[0], false, true, false)
            data.cubeCamera.update(rendererPtr[0], scene)
        },
        (queued) => {
            for (const manager of reflectionVisibleSet)
                manager.outerObject3d.visible = true
            for (const manager of queued.keys())
                manager.outerObject3d.visible = false
        },
        (queued) => {
            for (const manager of reflectionVisibleSet)
                manager.outerObject3d.visible = false
            for (const manager of queued.keys())
                manager.outerObject3d.visible = true
        },
        onRenderHalfRate
    )
