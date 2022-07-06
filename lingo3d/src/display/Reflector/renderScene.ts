import { PerspectiveCamera, Scene, WebGLRenderer, WebGLRenderTarget } from "three"

export default (
    renderer: WebGLRenderer,
    renderTarget: WebGLRenderTarget,
    scene: Scene,
    camera: PerspectiveCamera
) => {
    renderTarget.texture.encoding = renderer.outputEncoding

    const currentRenderTarget = renderer.getRenderTarget()

    const currentXrEnabled = renderer.xr.enabled
    const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate

    renderer.xr.enabled = false // Avoid camera modification
    renderer.shadowMap.autoUpdate = false // Avoid re-computing shadows

    renderer.setRenderTarget(renderTarget)

    renderer.state.buffers.depth.setMask(true) // make sure the depth buffer is writable so it can be properly cleared, see #18897

    if (renderer.autoClear === false) renderer.clear()
    renderer.render(scene, camera)

    renderer.xr.enabled = currentXrEnabled
    renderer.shadowMap.autoUpdate = currentShadowAutoUpdate

    renderer.setRenderTarget(currentRenderTarget)
}
