import { Object3D } from "three"
import scene from "../../../scene"

export const ssrExcludeSet = new Set<Object3D>()

let sceneBackground: any
export const beforeRenderSSR = () => {
    sceneBackground = scene.background
    scene.background = null
    for (const target of ssrExcludeSet) target.visible = false
}

export const afterRenderSSR = () => {
    scene.background = sceneBackground
    for (const target of ssrExcludeSet) target.visible = true
}
