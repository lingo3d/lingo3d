import { event } from "@lincode/events"
import { Color, Texture } from "three"
import { ssrExcludeSet } from "../collections/ssrExcludeSet"
import scene from "../engine/scene"
import { blackColor } from "../display/utils/reusables"

export const [emitRenderSSR, onRenderSSR] = event<"before" | "after">()

let sceneBackground: Color | Texture | null
onRenderSSR((phase) => {
    if (phase === "before") {
        sceneBackground = scene.background
        scene.background = blackColor
        for (const target of ssrExcludeSet) target.visible = false
        return
    }
    scene.background = sceneBackground
    for (const target of ssrExcludeSet) target.visible = true
})
