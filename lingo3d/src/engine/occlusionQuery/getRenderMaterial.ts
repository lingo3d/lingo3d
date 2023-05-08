import {
    BackSide,
    DoubleSide,
    FrontSide,
    Material,
    Object3D,
    ShaderChunk,
    ShaderMaterial,
    SpriteMaterial
} from "three"

const materialCache: Array<ShaderMaterial> = []
const pickingMaterialMap = new WeakMap<Object3D, ShaderMaterial>()

export default (object: Object3D, material: Material) => {
    if (pickingMaterialMap.has(object)) return pickingMaterialMap.get(object)!

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

    if (materialCache[index]) {
        pickingMaterialMap.set(object, materialCache[index])
        return materialCache[index]
    }

    let vertexShader = ShaderChunk.meshbasic_vert
    if (sprite) {
        vertexShader = ShaderChunk.sprite_vert
        if (sizeAttenuation)
            vertexShader = "#define USE_SIZEATTENUATION\n\n" + vertexShader
    }
    const renderMaterial = new ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: `
                uniform vec4 objectId;
                void main() {
                    gl_FragColor = objectId;
                }
            `,
        side: material.side
    })
    renderMaterial.uniforms = { objectId: { value: [1.0, 1.0, 1.0, 1.0] } }
    pickingMaterialMap.set(object, (materialCache[index] = renderMaterial))
    return renderMaterial
}
