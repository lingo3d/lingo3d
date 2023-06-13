import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { nullableDefault } from "./utils/NullableDefault"
import Range from "./utils/Range"
import { Blending, ColorString } from "./ITexturedStandard"
import Choices from "./utils/Choices"

export default interface ITexturedBasic {
    color: Nullable<ColorString>
    opacity: Nullable<number>
    texture: Nullable<string>
    alphaMap: Nullable<string>
    textureRepeat: Nullable<number>
    textureFlipY: Nullable<boolean>
    textureRotation: Nullable<number>
    depthTest: Nullable<boolean>
    blending: Nullable<Blending>
}

export const texturedBasicSchema: Required<ExtractProps<ITexturedBasic>> = {
    color: String,
    opacity: Number,
    texture: String,
    alphaMap: String,
    textureRepeat: Number,
    textureFlipY: Boolean,
    textureRotation: Number,
    depthTest: Boolean,
    blending: String
}

export const texturedBasicDefaults = extendDefaults<ITexturedBasic>(
    [],
    {
        color: nullableDefault("#ffffff"),
        opacity: nullableDefault(1),
        texture: undefined,
        alphaMap: undefined,
        textureRepeat: nullableDefault(1),
        textureFlipY: nullableDefault(false),
        textureRotation: nullableDefault(0),
        depthTest: nullableDefault(true),
        blending: nullableDefault("normal")
    },
    {
        opacity: new Range(0, 1),
        textureRotation: new Range(0, 360),
        blending: new Choices({
            additive: "additive",
            subtractive: "subtractive",
            multiply: "multiply",
            normal: "normal"
        })
    }
)
