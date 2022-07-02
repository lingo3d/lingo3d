import { SSRPass } from "./SSRPass"
import scene from "../../../scene"
import { Mesh, Object3D } from "three"
import { pull } from "@lincode/utils"
import { HEIGHT, WIDTH } from "../../../../globals"
import { getRenderer } from "../../../../states/useRenderer"
import { getCameraRendered } from "../../../../states/useCameraRendered"
import { getSSROpacity } from "../../../../states/useSSROpacity"
import { getResolution } from "../../../../states/useResolution"
import { createEffect } from "@lincode/reactivity"
import { getCameraPointerLock } from "../../../../states/useCameraPointerLock"

export const ssrPtr = [false]

const ssrSelects: Array<Mesh> = []

export const addSSR = (target: Object3D) => {
    if (target.userData.ssr) return
    target.userData.ssr = true
    ssrSelects.push(target as Mesh)
    ssrPtr[0] = true
}

export const deleteSSR = (target: Object3D) => {
    if (!target.userData.ssr) return
    target.userData.ssr = false
    pull(ssrSelects, target as Mesh)
}

const ssrPass = new SSRPass({
    renderer: undefined as any,
    scene,
    camera: getCameraRendered(),
    width: WIDTH,
    height: HEIGHT,
    groundReflector: null,
    selects: ssrSelects
})
export default ssrPass

createEffect(() => {
    const [w, h] = getResolution()

    //hack to make lower resolution work after cameraPointerLock changes
    requestAnimationFrame(() => {
        ssrPass.setSize(w * 0.5, h * 0.5)
    })
}, [getResolution, getCameraRendered, getCameraPointerLock])

getRenderer((renderer) => renderer && (ssrPass.renderer = renderer))
getCameraRendered((camera) => (ssrPass.camera = camera))
getSSROpacity((opacity) => (ssrPass.opacity = opacity))
