import { Color, Texture } from "three"
import scene from "../../../scene"
import { ssrExcludeSet } from "../../../../collections/ssrExcludeSet"

let sceneBackground: Color | Texture | null
export const beforeRenderSSR = () => {
    sceneBackground = scene.background
    scene.background = null
    for (const target of ssrExcludeSet) target.visible = false
}

export const afterRenderSSR = () => {
    scene.background = sceneBackground
    for (const target of ssrExcludeSet) target.visible = true
}
