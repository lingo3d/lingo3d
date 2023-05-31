import { CubeCamera, WebGLCubeRenderTarget } from "three"
import MeshAppendable from "../display/core/MeshAppendable"
import getWorldPosition from "../memo/getWorldPosition"
import scene from "../engine/scene"
import { reflectionVisibleSet } from "../collections/reflectionCollections"
import { rendererPtr } from "../pointers/rendererPtr"
import { ssrExcludeSet } from "../collections/ssrExcludeSet"
import createSystem from "./utils/createInternalSystem"

export const reflectionSystem = createSystem("reflectionSystem", {
    data: {} as {
        cubeCamera: CubeCamera
        cubeRenderTarget: WebGLCubeRenderTarget
    },
    update: (manager: MeshAppendable, data) => {
        data.cubeCamera.position.copy(getWorldPosition(manager.outerObject3d))
        data.cubeRenderTarget.clear(rendererPtr[0], false, true, false)
        data.cubeCamera.update(rendererPtr[0], scene)
    },
    beforeTick: (queued) => {
        for (const manager of reflectionVisibleSet)
            manager.outerObject3d.visible = true
        for (const manager of queued.keys())
            manager.outerObject3d.visible = false
        for (const object of ssrExcludeSet) object.visible = false
    },
    afterTick: (queued) => {
        for (const manager of reflectionVisibleSet)
            manager.outerObject3d.visible = false
        for (const manager of queued.keys())
            manager.outerObject3d.visible = true
        for (const object of ssrExcludeSet) object.visible = true
    }
})
