import {
    WebGLRenderTarget,
    NearestFilter,
    RGBAFormat,
    Object3D,
    Mesh,
    SpriteMaterial,
    Sprite,
    Scene,
    Color
} from "three"
import Appendable from "../display/core/Appendable"
import {
    idRenderCheckMap,
    idRenderCheckModelMap
} from "../collections/idCollections"
import { renderCheckExcludeSet } from "../collections/renderCheckExcludeSet"
import { whiteColor } from "../display/utils/reusables"
import scene from "../engine/scene"
import getOcclusionMaterial from "../memo/getOcclusionMaterial"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import { rendererPtr } from "../pointers/rendererPtr"
import throttle from "./utils/throttle"

const SIZE = 100

const renderTarget = new WebGLRenderTarget(SIZE, SIZE, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat
})

const processItem = (object: Object3D) => {
    const { id, material, geometry } = object as Mesh
    if (renderCheckExcludeSet.has(object) || object.type === "Sprite") return

    const renderMaterial = getOcclusionMaterial(object as Mesh)
    if (object.type === "Sprite") {
        renderMaterial.uniforms.rotation = {
            value: (material as SpriteMaterial).rotation
        }
        renderMaterial.uniforms.center = { value: (object as Sprite).center }
    }
    renderMaterial.uniforms.objectId.value = [
        ((id >> 24) & 255) / 255,
        ((id >> 16) & 255) / 255,
        ((id >> 8) & 255) / 255,
        (id & 255) / 255
    ]
    renderMaterial.uniformsNeedUpdate = true
    rendererPtr[0].renderBufferDirect(
        cameraRenderedPtr[0],
        emptyScene,
        geometry!,
        renderMaterial,
        object,
        null
    )
}

const emptyScene = new Scene()
emptyScene.onAfterRender = () => {
    const renderList = rendererPtr[0].renderLists.get(scene, 0)
    for (const item of renderList.opaque) processItem(item.object)
    for (const item of renderList.transmissive) processItem(item.object)
    for (const item of renderList.transparent) processItem(item.object)
}

const pixelBuffer = new Uint8Array(4 * SIZE * SIZE)
const currClearColor = new Color()
const idSet = new Set<number>()
const renderedSet = new Set<Appendable>()

export default throttle(() => {
    const renderer = rendererPtr[0]

    const currRenderTarget = renderer.getRenderTarget()
    const currAlpha = renderer.getClearAlpha()
    renderer.getClearColor(currClearColor)
    renderer.setRenderTarget(renderTarget)
    renderer.setClearColor(whiteColor)
    renderer.clear()
    renderer.render(emptyScene, cameraRenderedPtr[0])
    renderer.readRenderTargetPixels(renderTarget, 0, 0, SIZE, SIZE, pixelBuffer)
    renderer.setRenderTarget(currRenderTarget)
    renderer.setClearColor(currClearColor, currAlpha)

    idSet.clear()
    const iMax = SIZE * SIZE * 4
    for (let i = 0; i < iMax; i += 4)
        idSet.add(
            (pixelBuffer[i] << 24) +
                (pixelBuffer[i + 1] << 16) +
                (pixelBuffer[i + 2] << 8) +
                pixelBuffer[i + 3]
        )
    renderedSet.clear()
    for (const id of idSet) {
        const manager = idRenderCheckMap.get(id)
        manager && renderedSet.add(manager)
        const model = idRenderCheckModelMap.get(id)
        model && renderedSet.add(model)
    }
    return renderedSet
}, 200)
