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
}

export const texturedStandardDefaults: ITexturedStandard = {
    color: "#ffffff",
    emissiveColor: "#000000",
    flatShading: false,
    wireframe: false,
    envMap: undefined,
    aoMap: undefined,
    aoMapIntensity: 1,
    bumpMap: undefined,
    bumpScale: 1,
    displacementMap: undefined,
    displacementScale: 1,
    displacementBias: 0,
    emissiveMap: undefined,
    emissiveIntensity: 1,
    lightMap: undefined,
    lightMapIntensity: 1,
    metalnessMap: undefined,
    metalness: 0,
    roughnessMap: undefined,
    roughness: 1,
    normalMap: undefined,
    normalScale: { x: 1, y: 1 },
    normalMapType: undefined
}