import { Object3D } from "three"
import { onAfterRender } from "../events/onAfterRender"
import scene from "../engine/scene"
import { rendererPtr } from "./rendererPtr"

export const renderedOpaqueObjectsPtr: [Array<Object3D>] = [[]]

onAfterRender(() => {
    renderedOpaqueObjectsPtr[0] = rendererPtr[0].renderLists
        .get(scene, 0)
        .opaque.map((item) => item.object)
})
