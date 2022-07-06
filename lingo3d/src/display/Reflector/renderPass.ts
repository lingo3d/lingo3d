import { ShaderMaterial, WebGLRenderer, WebGLRenderTarget } from "three"
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass"

const fsQuad = new FullScreenQuad()

export default (
    renderer: WebGLRenderer,
    passMaterial: ShaderMaterial,
    renderTarget: WebGLRenderTarget
) => {
    renderer.setRenderTarget(renderTarget)

    if (renderer.autoClear === false) renderer.clear()

    fsQuad.material = passMaterial
    fsQuad.render(renderer)
}
