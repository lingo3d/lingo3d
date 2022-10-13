import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"

export default interface ITexturedStandard {
    wireframe: Nullable<boolean>
    envMap: Nullable<string>
    envMapIntensity: Nullable<number>
    aoMap: Nullable<string>
    aoMapIntensity: Nullable<number>
    bumpMap: Nullable<string>
    bumpScale: Nullable<number>
    displacementMap: Nullable<string>
    displacementScale: Nullable<number>
    displacementBias: Nullable<number>
    emissive: Nullable<boolean>
    emissiveIntensity: Nullable<number>
    lightMap: Nullable<string>
    lightMapIntensity: Nullable<number>
    metalnessMap: Nullable<string>
    metalness: Nullable<number>
    roughnessMap: Nullable<string>
    roughness: Nullable<number>
    normalMap: Nullable<string>
    normalScale: Nullable<number>
}

export const texturedStandardSchema: Required<ExtractProps<ITexturedStandard>> =
    {
        wireframe: Boolean,
        envMap: String,
        envMapIntensity: Number,
        aoMap: String,
        aoMapIntensity: Number,
        bumpMap: String,
        bumpScale: Number,
        displacementMap: String,
        displacementScale: Number,
        displacementBias: Number,
        emissive: Boolean,
        emissiveIntensity: Number,
        lightMap: String,
        lightMapIntensity: Number,
        metalnessMap: String,
        metalness: Number,
        roughnessMap: String,
        roughness: Number,
        normalMap: String,
        normalScale: Number
    }

export const texturedStandardDefaults = extendDefaults<ITexturedStandard>([
    {
        wireframe: new NullableDefault(false),
        envMap: undefined,
        envMapIntensity: new NullableDefault(1),
        aoMap: undefined,
        aoMapIntensity: new NullableDefault(1),
        bumpMap: undefined,
        bumpScale: new NullableDefault(1),
        displacementMap: undefined,
        displacementScale: new NullableDefault(1),
        displacementBias: new NullableDefault(0),
        emissive: new NullableDefault(false),
        emissiveIntensity: new NullableDefault(1),
        lightMap: undefined,
        lightMapIntensity: new NullableDefault(1),
        metalnessMap: undefined,
        metalness: new NullableDefault(0),
        roughnessMap: undefined,
        roughness: new NullableDefault(1),
        normalMap: undefined,
        normalScale: new NullableDefault(1)
    }
])
