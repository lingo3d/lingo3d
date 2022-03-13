type Vector2 = { x: number, y: number }

export type NormalMapType = "objectSpace" | "tangentSpace"

export default interface ITexturedStandard {
    color: string
    emissiveColor: string
    flatShading: boolean
    wireframe: boolean
    envMap?: string
    aoMap?: string
    aoMapIntensity: number
    bumpMap?: string
    bumpScale: number
    displacementMap?: string
    displacementScale: number
    displacementBias: number
    emissiveMap?: string
    emissiveIntensity: number
    lightMap?: string
    lightMapIntensity: number
    metalnessMap?: string
    metalness: number
    roughnessMap?: string
    roughness: number
    normalMap?: string
    normalScale: Vector2 | number
    normalMapType?: NormalMapType
    refractionRatio: number
    textureRepeat?: Vector2 | number
}