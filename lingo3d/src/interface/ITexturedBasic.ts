import { Point } from "@lincode/math"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { nullableDefault } from "./utils/NullableDefault"
import Range from "./utils/Range"
import { ColorString } from "./ITexturedStandard"

export default interface ITexturedBasic {
    color: Nullable<ColorString>
    opacity: Nullable<number>
    texture: Nullable<string>
    alphaMap: Nullable<string>
    textureRepeat: Nullable<Point | number>
    textureFlipY: Nullable<boolean>
    textureRotation: Nullable<number>
}

export const texturedBasicSchema: Required<ExtractProps<ITexturedBasic>> = {
    color: String,
    opacity: Number,
    texture: String,
    alphaMap: String,
    textureRepeat: [Object, Number],
    textureFlipY: Boolean,
    textureRotation: Number
}

export const texturedBasicDefaults = extendDefaults<ITexturedBasic>(
    [],
    {
        color: nullableDefault("#ffffff"),
        opacity: nullableDefault(1),
        texture: undefined,
        alphaMap: undefined,
        textureRepeat: nullableDefault({ x: 1, y: 1 }),
        textureFlipY: nullableDefault(false),
        textureRotation: nullableDefault(0)
    },
    {
        opacity: new Range(0, 1),
        textureRotation: new Range(0, 360)
    }
)
