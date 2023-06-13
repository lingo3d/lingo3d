import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { nullableDefault } from "./utils/NullableDefault"
import Range from "./utils/Range"
import { ColorRepresentation } from "three"
import Choices from "./utils/Choices"

export type ColorString = Extract<ColorRepresentation, string>

export type Blending = "additive" | "subtractive" | "multiply" | "normal"

export default interface ITexturedStandard {
    color: Nullable<ColorString>
    opacity: Nullable<number>
    texture: Nullable<string>
    alphaMap: Nullable<string>
    textureRepeat: Nullable<number>
    textureFlipY: Nullable<boolean>
    textureRotation: Nullable<number>

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
    depthTest: Nullable<boolean>
    blending: Nullable<Blending>
}

export const texturedStandardSchema: Required<ExtractProps<ITexturedStandard>> =
    {
        color: String,
        opacity: Number,
        texture: String,
        alphaMap: String,
        textureRepeat: Number,
        textureFlipY: Boolean,
        textureRotation: Number,

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
        normalScale: Number,
        depthTest: Boolean,
        blending: String
    }

export const blendingChoices = new Choices({
    additive: "additive",
    subtractive: "subtractive",
    multiply: "multiply",
    normal: "normal"
})

export const texturedStandardDefaults = extendDefaults<ITexturedStandard>(
    [],
    {
        color: nullableDefault("#ffffff"),
        opacity: nullableDefault(1),
        texture: undefined,
        alphaMap: undefined,
        textureRepeat: nullableDefault(1),
        textureFlipY: nullableDefault(false),
        textureRotation: nullableDefault(0),

        wireframe: nullableDefault(false),
        envMap: undefined,
        envMapIntensity: nullableDefault(1),
        aoMap: undefined,
        aoMapIntensity: nullableDefault(1),
        bumpMap: undefined,
        bumpScale: nullableDefault(1),
        displacementMap: undefined,
        displacementScale: nullableDefault(1),
        displacementBias: nullableDefault(0),
        emissive: nullableDefault(false),
        emissiveIntensity: nullableDefault(1),
        lightMap: undefined,
        lightMapIntensity: nullableDefault(1),
        metalnessMap: undefined,
        metalness: nullableDefault(0),
        roughnessMap: undefined,
        roughness: nullableDefault(1),
        normalMap: undefined,
        normalScale: nullableDefault(1),
        depthTest: nullableDefault(true),
        blending: nullableDefault("normal")
    },
    {
        opacity: new Range(0, 1),
        textureRotation: new Range(0, 360),

        envMapIntensity: new Range(0, 4),
        aoMapIntensity: new Range(0, 4),
        bumpScale: new Range(0, 4),
        displacementScale: new Range(0, 4),
        displacementBias: new Range(0, 4),
        emissiveIntensity: new Range(0, 1),
        lightMapIntensity: new Range(0, 4),
        metalness: new Range(-2, 2),
        roughness: new Range(0, 4),
        normalScale: new Range(0, 4),
        blending: blendingChoices
    }
)
