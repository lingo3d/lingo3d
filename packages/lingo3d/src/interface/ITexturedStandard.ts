import { ExtractProps } from "./utils/extractProps"

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

export const texturedStandardSchema: Required<ExtractProps<ITexturedStandard>> = {
    color: String,
    emissiveColor: String,
    flatShading: Boolean,
    wireframe: Boolean,
    envMap: String,
    aoMap: String,
    aoMapIntensity: Number,
    bumpMap: String,
    bumpScale: Number,
    displacementMap: String,
    displacementScale: Number,
    displacementBias: Number,
    emissiveMap: String,
    emissiveIntensity: Number,
    lightMap: String,
    lightMapIntensity: Number,
    metalnessMap: String,
    metalness: Number,
    roughnessMap: String,
    roughness: Number,
    normalMap: String,
    normalScale: [Object, Number],
    normalMapType: String
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