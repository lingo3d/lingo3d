import {
    NearestFilter,
    WebGLRenderTarget,
    RGBAFormat,
    LinearEncoding,
    Scene,
    Color,
    FrontSide,
    BackSide,
    DoubleSide,
    ShaderChunk,
    ShaderMaterial
} from "three"
import { rendererPtr } from "../../pointers/rendererPtr"
import scene from "../scene"
import { cameraRenderedPtr } from "../../pointers/cameraRenderedPtr"
import { resolutionPtr } from "../../pointers/resolutionPtr"

export default function () {
    // This is the 1x1 pixel render target we use to do the picking
    var pickingTarget = new WebGLRenderTarget(1, 1, {
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        format: RGBAFormat,
        encoding: LinearEncoding
    })
    // We need to be inside of .render in order to call renderBufferDirect in renderList() so create an empty scene
    // and use the onAfterRender callback to actually render geometry for picking.
    var emptyScene = new Scene()
    emptyScene.onAfterRender = renderList
    // RGBA is 4 channels.
    var pixelBuffer = new Uint8Array(
        4 * pickingTarget.width * pickingTarget.height
    )
    var clearColor = new Color(0xffffff)
    var materialCache = []

    var currClearColor = new Color()

    let _renderer, _camera, _resolution
    this.pick = function (x, y) {
        _renderer = rendererPtr[0]
        _camera = cameraRenderedPtr[0]
        _resolution = resolutionPtr[0]

        // Set the projection matrix to only look at the pixel we are interested in.
        _camera.setViewOffset(_resolution[0], _resolution[1], x, y, 1, 1)
        var currRenderTarget = _renderer.getRenderTarget()
        var currAlpha = _renderer.getClearAlpha()
        _renderer.getClearColor(currClearColor)
        _renderer.setRenderTarget(pickingTarget)
        _renderer.setClearColor(clearColor)
        _renderer.clear()
        _renderer.render(emptyScene, _camera)
        _renderer.readRenderTargetPixels(
            pickingTarget,
            0,
            0,
            pickingTarget.width,
            pickingTarget.height,
            pixelBuffer
        )
        _renderer.setRenderTarget(currRenderTarget)
        _renderer.setClearColor(currClearColor, currAlpha)
        _camera.clearViewOffset()

        var val =
            (pixelBuffer[0] << 24) +
            (pixelBuffer[1] << 16) +
            (pixelBuffer[2] << 8) +
            pixelBuffer[3]
        return val
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

        var useSkinning = object.isSkinnedMesh ? 1 : 0
        var useInstancing = object.isInstancedMesh === true ? 1 : 0
        var frontSide = material.side === FrontSide ? 1 : 0
        var backSide = material.side === BackSide ? 1 : 0
        var doubleSide = material.side === DoubleSide ? 1 : 0
        var sprite = material.type === "SpriteMaterial" ? 1 : 0
        var sizeAttenuation = material.sizeAttenuation ? 1 : 0
        var index =
            (useMorphing << 0) |
            (useSkinning << 1) |
            (useInstancing << 2) |
            (frontSide << 3) |
            (backSide << 4) |
            (doubleSide << 5) |
            (sprite << 6) |
            (sizeAttenuation << 7)
        var renderMaterial = renderItem.object.pickingMaterial
            ? renderItem.object.pickingMaterial
            : materialCache[index]
        if (!renderMaterial) {
            let vertexShader = ShaderChunk.meshbasic_vert
            if (sprite) {
                vertexShader = ShaderChunk.sprite_vert
                if (sizeAttenuation)
                    vertexShader =
                        "#define USE_SIZEATTENUATION\n\n" + vertexShader
            }
            renderMaterial = new ShaderMaterial({
                vertexShader: vertexShader,
                fragmentShader: `
            uniform vec4 objectId;
            void main() {
              gl_FragColor = objectId;
            }
          `,
                side: material.side
            })
            ;(renderMaterial.skinning = useSkinning > 0),
                (renderMaterial.morphTargets = useMorphing > 0),
                (renderMaterial.uniforms = {
                    objectId: { value: [1.0, 1.0, 1.0, 1.0] }
                })
            materialCache[index] = renderMaterial
        }
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
