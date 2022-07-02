import { SSRPass } from "./SSRPass"
import scene from "../../../scene"
import { Mesh, Object3D } from "three"
import { pull } from "@lincode/utils"
import { HEIGHT, WIDTH } from "../../../../globals"
import { getRenderer } from "../../../../states/useRenderer"
import { getCameraRendered } from "../../../../states/useCameraRendered"
import { getSSROpacity } from "../../../../states/useSSROpacity"
import store, { createEffect } from "@lincode/reactivity"
import { getSSR } from "../../../../states/useSSR"
import { getAntiAlias } from "../../../../states/useAntiAlias"

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
        selects: ssrSelects,
        msaa: getAntiAlias() === "MSAA"
    })
    setSSRPass(ssrPass)

    return () => {
        setSSRPass(undefined)
        ssrPass.dispose()
    }
}, [getRenderer, getCameraRendered, getSSR, getAntiAlias])

createEffect(() => {
    const ssrPass = getSSRPass()
    if (!ssrPass) return

    ssrPass.opacity = getSSROpacity()

}, [getSSROpacity, getSSRPass])