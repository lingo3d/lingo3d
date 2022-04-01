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
    textureRepeat?: Vector2 | number
}

export const texturedStandardDefaults: ITexturedStandard = {
    color: "#ffffff",
    emissiveColor: "#000000",
    flatShading: false,
    wireframe: false,
    aoMapIntensity: 1,
    bumpScale: 1,
    displacementScale: 1,
    displacementBias: 0,
    emissiveIntensity: 1,
    lightMapIntensity: 1,
    metalness: 0,
    roughness: 1,
    normalScale: { x: 1, y: 1 }
}