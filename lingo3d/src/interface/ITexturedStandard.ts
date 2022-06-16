import { Point } from "@lincode/math"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export type NormalMapType = "objectSpace" | "tangentSpace"

export default interface ITexturedStandard {
    color: string
    flatShading: boolean
    wireframe: boolean
    envMap: Nullable<string>
    aoMap: Nullable<string>
    aoMapIntensity: number
    bumpMap: Nullable<string>
    bumpScale: number
    displacementMap: Nullable<string>
    displacementScale: number
    displacementBias: number
    emissiveColor: string
    emissiveMap: Nullable<string>
    emissiveIntensity: number
    lightMap: Nullable<string>
    lightMapIntensity: number
    metalnessMap: Nullable<string>
    metalness: number
    roughnessMap: Nullable<string>
    roughness: number
    normalMap: Nullable<string>
    normalScale: Point | number
    normalMapType: Nullable<NormalMapType>
}

export const texturedStandardSchema: Required<ExtractProps<ITexturedStandard>> = {
    color: String,
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
    emissiveColor: String,
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
    emissiveColor: "#000000",
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

export const texturedStandardRequiredDefaults: ITexturedStandard = {
    ...texturedStandardDefaults,
    envMap: "",
    aoMap: "",
    bumpMap: "",
    displacementMap: "",
    emissiveMap: "",
    lightMap: "",
    metalnessMap: "",
    roughnessMap: "",
    normalMap: "",
    normalMapType: "objectSpace"
}