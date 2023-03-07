import { createEffect } from "@lincode/reactivity"
import { EffectComposer, MaskPass, RenderPass } from "postprocessing"
import {
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    WebGLRenderTarget
} from "three"
import Model from "../display/Model"
import scene from "../engine/scene"
import { updateCameraAspect } from "../states/useCameraRendered"
import { getRenderer } from "../states/useRenderer"
import { getResolution } from "../states/useResolution"
import { getViewportSize } from "../states/useViewportSize"
import { getWebXR } from "../states/useWebXR"

const map = new Model()
map.scale = 10
map.src = "cathedral.glb"

const portalCamera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

const portalRenderTarget = new WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight
)

const portalGeometry = new PlaneGeometry(5, 5)
const portalMaterial = new MeshBasicMaterial({
    map: portalRenderTarget.texture
})
const portalMesh = new Mesh(portalGeometry, portalMaterial)
// position the portal mesh appropriately
scene.add(portalMesh)

const portalPass = new RenderPass(scene, portalCamera)
const maskPass = new MaskPass(scene, portalCamera)
const effectComposer = new EffectComposer()
getRenderer((renderer) => renderer && effectComposer.setRenderer(renderer))

createEffect(() => {
    updateCameraAspect(portalCamera)
}, [getResolution, getViewportSize, getWebXR])
