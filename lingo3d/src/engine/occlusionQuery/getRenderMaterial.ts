import {
    BackSide,
    DoubleSide,
    FrontSide,
    ShaderChunk,
    ShaderMaterial
} from "three"

const materialCache: Array<ShaderMaterial> = []

export default (object: any, material: any, useMorphing: any, sprite: any) => {
    if (object.pickingMaterial) return object.pickingMaterial

    const useSkinning = object.isSkinnedMesh ? 1 : 0
    const useInstancing = object.isInstancedMesh === true ? 1 : 0
    const frontSide = material.side === FrontSide ? 1 : 0
    const backSide = material.side === BackSide ? 1 : 0
    const doubleSide = material.side === DoubleSide ? 1 : 0
    const sizeAttenuation = material.sizeAttenuation ? 1 : 0
    const index =
        (useMorphing << 0) |
        (useSkinning << 1) |
        (useInstancing << 2) |
        (frontSide << 3) |
        (backSide << 4) |
        (doubleSide << 5) |
        (sprite << 6) |
        (sizeAttenuation << 7)
    if (materialCache[index])
        return (object.pickingMaterial = materialCache[index])

    let vertexShader = ShaderChunk.meshbasic_vert
    if (sprite) {
        vertexShader = ShaderChunk.sprite_vert
        if (sizeAttenuation)
            vertexShader = "#define USE_SIZEATTENUATION\n\n" + vertexShader
    }
    const renderMaterial: any = new ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: `
                uniform vec4 objectId;
                void main() {
                    gl_FragColor = objectId;
                }
            `,
        side: material.side
    })
    renderMaterial.skinning = useSkinning > 0
    renderMaterial.morphTargets = useMorphing > 0
    renderMaterial.uniforms = {
        objectId: { value: [1.0, 1.0, 1.0, 1.0] }
    }
    object.pickingMaterial = materialCache[index] = renderMaterial
    return renderMaterial
}
