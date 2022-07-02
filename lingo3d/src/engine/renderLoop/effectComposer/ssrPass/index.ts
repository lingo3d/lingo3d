import { SSRPass } from "./SSRPass"
import scene from "../../../scene"
import { Mesh, Object3D } from "three"
import { pull } from "@lincode/utils"
import { HEIGHT, WIDTH } from "../../../../globals"
import { getRenderer } from "../../../../states/useRenderer"
import { getCameraRendered } from "../../../../states/useCameraRendered"
import { getSSROpacity } from "../../../../states/useSSROpacity"
import { getResolution } from "../../../../states/useResolution"
import store, { createEffect } from "@lincode/reactivity"
import { getSSR } from "../../../../states/useSSR"

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

const [setSSRPass, getSSRPass] = store<SSRPass | undefined>(undefined)
export { getSSRPass }

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer || !getSSR()) return

    const ssrPass = new SSRPass({
        renderer,
        scene,
        camera: getCameraRendered(),
        width: WIDTH,
        height: HEIGHT,
        groundReflector: null,
        selects: ssrSelects
    })
    setSSRPass(ssrPass)

    return () => {
        ssrPass.dispose()
        setSSRPass(undefined)
    }
}, [getRenderer, getCameraRendered, getSSR])

createEffect(() => {
    const ssrPass = getSSRPass()
    if (!ssrPass) return

    const [w, h] = getResolution()
    ssrPass.setSize(w * 0.5, h * 0.5)

}, [getResolution, getSSRPass])

createEffect(() => {
    const ssrPass = getSSRPass()
    if (!ssrPass) return

    ssrPass.opacity = getSSROpacity()

}, [getSSROpacity, getSSRPass])