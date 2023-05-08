import {
    Mesh,
    MeshBasicMaterial,
    OrthographicCamera,
    PlaneGeometry,
    Scene,
    WebGLRenderTarget,
    WebGLRenderer
} from "three"
import { onAfterRender } from "../../events/onAfterRender"

export default (renderTarget: WebGLRenderTarget) => {
    const renderTargetScene = new Scene()
    const renderTargetCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderTargetMesh = new Mesh(
        new PlaneGeometry(2, 2),
        new MeshBasicMaterial()
    )
    renderTargetScene.add(renderTargetMesh)

    // set the texture of the mesh to the render target's texture
    renderTargetMesh.material.map = renderTarget.texture

    // create a new renderer and add the render target scene to the render loop
    const renderer = new WebGLRenderer()
    document.body.appendChild(renderer.domElement)

    const aspect = renderTarget.width / renderTarget.height
    renderer.setSize(200, 200 / aspect)

    Object.assign(renderer.domElement.style, {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 9999
    })
    onAfterRender(() => {
        // render the render target scene to the screen
        renderer.render(renderTargetScene, renderTargetCamera)
    })
}
