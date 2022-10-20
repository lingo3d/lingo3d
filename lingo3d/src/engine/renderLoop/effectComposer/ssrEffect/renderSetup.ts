import { Object3D } from "three"
import scene from "../../../scene"

export const ssrExcludeSet = new Set<Object3D>()

let sceneBackground: any
export const beforeRenderSSR = () => {
    sceneBackground = scene.background
    scene.background = null
    for (const target of ssrExcludeSet) {
        target.userData.visible = target.visible
        target.visible = false
    }
}

export const afterRenderSSR = () => {
    scene.background = sceneBackground
    for (const target of ssrExcludeSet) target.visible = target.userData.visible
}
