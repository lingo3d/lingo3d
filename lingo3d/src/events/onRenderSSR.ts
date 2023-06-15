import { event } from "@lincode/events"
import { Color, Texture } from "three"
import { excludeSSRSet } from "../collections/excludeSSRSet"
import scene from "../engine/scene"

export const [emitRenderSSR, onRenderSSR] = event<"before" | "after">()

let sceneBackground: Color | Texture | null
onRenderSSR((phase) => {
    if (phase === "before") {
        sceneBackground = scene.background
        scene.background = null
        for (const target of excludeSSRSet) target.visible = false
        return
    }
    scene.background = sceneBackground
    for (const target of excludeSSRSet) target.visible = true
})
