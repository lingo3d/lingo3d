import {
    NearestFilter,
    WebGLRenderTarget,
    RGBAFormat,
    LinearEncoding,
    Scene,
    Color
} from "three"
import { rendererPtr } from "../../pointers/rendererPtr"
import scene from "../scene"
import { cameraRenderedPtr } from "../../pointers/cameraRenderedPtr"
import { resolutionPtr } from "../../pointers/resolutionPtr"
import getRenderMaterial from "./getRenderMaterial"

export default function () {
    const renderTarget = new WebGLRenderTarget(100, 100, {
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        format: RGBAFormat,
        encoding: LinearEncoding
    })
    // We need to be inside of .render in order to call renderBufferDirect in renderList() so create an empty scene
    // and use the onAfterRender callback to actually render geometry for picking.
    const emptyScene = new Scene()
    emptyScene.onAfterRender = renderList
    // RGBA is 4 channels.
    const pixelBuffer = new Uint8Array(
        4 * renderTarget.width * renderTarget.height
    )
    const clearColor = new Color(0xffffff)
    const currClearColor = new Color()

    let _renderer, _camera, _resolution, currRenderTarget, currAlpha
    this.pick = function () {
        _renderer = rendererPtr[0]
        _camera = cameraRenderedPtr[0]
        _resolution = resolutionPtr[0]

        // Set the projection matrix to only look at the pixel we are interested in.
        currRenderTarget = _renderer.getRenderTarget()
        currAlpha = _renderer.getClearAlpha()
        _renderer.getClearColor(currClearColor)
        _renderer.setRenderTarget(renderTarget)
        _renderer.setClearColor(clearColor)
        _renderer.clear()
        _renderer.render(emptyScene, _camera)
        _renderer.readRenderTargetPixels(
            renderTarget,
            0,
            0,
            renderTarget.width,
            renderTarget.height,
            pixelBuffer
        )
        _renderer.setRenderTarget(currRenderTarget)
        _renderer.setClearColor(currClearColor, currAlpha)

        const idSet = new Set()
        const iMax = 100 * 100 * 4
        for (let i = 0; i < iMax; i += 4)
            idSet.add(
                (pixelBuffer[i] << 24) +
                    (pixelBuffer[i + 1] << 16) +
                    (pixelBuffer[i + 2] << 8) +
                    pixelBuffer[i + 3]
            )
        console.log(idSet)
    }

    function renderList() {
        // This is the magic, these render lists are still filled with valid data.  So we can
        // submit them again for picking and save lots of work!
        var renderList = rendererPtr[0].renderLists.get(scene, 0)
        renderList.opaque.forEach(processItem)
        renderList.transmissive.forEach(processItem)
        renderList.transparent.forEach(processItem)
    }

    function processItem(renderItem) {
        var object = renderItem.object
        var objId = object.id

        var material = renderItem.material
        var geometry = renderItem.geometry

        var useMorphing = 0
        if (material.morphTargets === true) {
            if (geometry.isBufferGeometry === true) {
                useMorphing =
                    geometry.morphAttributes &&
                    geometry.morphAttributes.position &&
                    geometry.morphAttributes.position.length > 0
                        ? 1
                        : 0
            } else if (geometry.isGeometry === true) {
                useMorphing =
                    geometry.morphTargets && geometry.morphTargets.length > 0
                        ? 1
                        : 0
            }
        }
        const sprite = material.type === "SpriteMaterial" ? 1 : 0
        const renderMaterial = getRenderMaterial(
            object,
            material,
            useMorphing,
            sprite
        )
        if (sprite) {
            renderMaterial.uniforms.rotation = { value: material.rotation }
            renderMaterial.uniforms.center = { value: object.center }
        }
        renderMaterial.uniforms.objectId.value = [
            ((objId >> 24) & 255) / 255,
            ((objId >> 16) & 255) / 255,
            ((objId >> 8) & 255) / 255,
            (objId & 255) / 255
        ]
        renderMaterial.uniformsNeedUpdate = true
        rendererPtr[0].renderBufferDirect(
            cameraRenderedPtr[0],
            null,
            geometry,
            renderMaterial,
            object,
            null
        )
    }
}
