import {
    BackSide,
    DoubleSide,
    FrontSide,
    Material,
    Mesh,
    ShaderChunk,
    ShaderMaterial,
    SpriteMaterial
} from "three"
import computeOnce from "./utils/computeOnce"
import { createUnloadArray } from "../utils/createUnloadMap"

const materialCache = createUnloadArray<ShaderMaterial>()

export default computeOnce((object: Mesh) => {
    const material = object.material as Material
    const useSkinning = object.type === "SkinnedMesh" ? 1 : 0
    const useInstancing = object.type === "InstancedMesh" ? 1 : 0
    const frontSide = material.side === FrontSide ? 1 : 0
    const backSide = material.side === BackSide ? 1 : 0
    const doubleSide = material.side === DoubleSide ? 1 : 0
    const sprite = material.type === "SpriteMaterial" ? 1 : 0
    const sizeAttenuation = (material as SpriteMaterial).sizeAttenuation ? 1 : 0
    const index =
        (useSkinning << 1) |
        (useInstancing << 2) |
        (frontSide << 3) |
        (backSide << 4) |
        (doubleSide << 5) |
        (sprite << 6) |
        (sizeAttenuation << 7)

    if (materialCache[index]) return materialCache[index]

    let vertexShader = ShaderChunk.meshbasic_vert
    if (sprite) {
        vertexShader = ShaderChunk.sprite_vert
        if (sizeAttenuation)
            vertexShader = "#define USE_SIZEATTENUATION\n\n" + vertexShader
    }
    const renderMaterial = (materialCache[index] = new ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: `
            uniform vec4 objectId;
            void main() {
                gl_FragColor = objectId;
            }
        `,
        side: material.side
    }))
    renderMaterial.uniforms = { objectId: { value: [1.0, 1.0, 1.0, 1.0] } }
    return renderMaterial
})
