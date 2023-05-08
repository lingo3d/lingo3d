import { Sprite, SpriteMaterial, WebGLRenderTarget } from "three"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import canvasToWorld from "./canvasToWorld"
import { point2Vec } from "./vec2Point"

export default (renderTarget: WebGLRenderTarget) => {
    const plane = new Sprite(
        new SpriteMaterial({ map: renderTarget.texture, depthTest: false })
    )
    scene.add(plane)
    onBeforeRender(() => {
        plane.position.copy(point2Vec(canvasToWorld(100, 100)))
    })
}
