import { CubeCamera, WebGLCubeRenderTarget } from "three"
import MeshAppendable from "../api/core/MeshAppendable"
import getWorldPosition from "../utilsCached/getWorldPosition"
import scene from "../engine/scene"
import renderSystemWithLifeCycleAndData from "./utils/renderSystemWithLifeCycleAndData"
import { reflectionVisibleSet } from "../collections/reflectionCollections"
import { rendererPtr } from "../pointers/rendererPtr"
import { ssrExcludeSet } from "../collections/ssrExcludeSet"

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
            for (const object of ssrExcludeSet) object.visible = false
        },
        (queued) => {
            for (const manager of reflectionVisibleSet)
                manager.outerObject3d.visible = false
            for (const manager of queued.keys())
                manager.outerObject3d.visible = true
            for (const object of ssrExcludeSet) object.visible = true
        }
    )
