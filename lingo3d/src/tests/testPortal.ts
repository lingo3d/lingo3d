import { createEffect } from "@lincode/reactivity"
import { EffectComposer, MaskPass, RenderPass } from "postprocessing"
import {
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    WebGLRenderTarget
} from "three"
import Camera from "../display/cameras/Camera"
import Model from "../display/Model"
import { dtPtr } from "../engine/eventLoop"
import scene from "../engine/scene"
import { onBeforeRender } from "../events/onBeforeRender"
import { updateCameraAspect } from "../states/useCameraRendered"
import { getRenderer } from "../states/useRenderer"
import { getResolution } from "../states/useResolution"
import { getViewportSize } from "../states/useViewportSize"
import { getWebXR } from "../states/useWebXR"

const map = new Model()
map.scale = 10
map.src = "cathedral.glb"

const portalCamera = new Camera()
createEffect(() => {
    updateCameraAspect(portalCamera.camera)
}, [getResolution, getViewportSize, getWebXR])

const portalRenderTarget = new WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight
)
const portalGeometry = new PlaneGeometry(2, 2)
const portalMaterial = new MeshBasicMaterial({
    map: portalRenderTarget.texture
})
const portalMesh = new Mesh(portalGeometry, portalMaterial)
// position the portal mesh appropriately
scene.add(portalMesh)

const portalPass = new RenderPass(scene, portalCamera.camera)
const effectComposer = new EffectComposer()

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer) return

    effectComposer.setRenderer(renderer)
    effectComposer.setSize(200, 200)
    effectComposer.addPass(portalPass)

    const handle = onBeforeRender(() => effectComposer.render(dtPtr[0]))

    return () => {
        effectComposer.removePass(portalPass)
        handle.cancel()
    }
}, [getRenderer])
