import { Point } from "@lincode/math"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"
import Range from "./utils/Range"

export default interface ITexturedBasic {
    color: Nullable<string>
    opacity: Nullable<number>
    texture: Nullable<string | HTMLVideoElement>
    videoTexture: Nullable<string | HTMLVideoElement>
    alphaMap: Nullable<string>
    textureRepeat: Nullable<Point | number>
    textureFlipY: Nullable<boolean>
    textureRotation: Nullable<number>
}

export const texturedBasicSchema: Required<ExtractProps<ITexturedBasic>> = {
    color: String,
    opacity: Number,
    texture: [String, Object],
    videoTexture: [String, Object],
    alphaMap: String,
    textureRepeat: [Object, Number],
    textureFlipY: Boolean,
    textureRotation: Number
}

export const texturedBasicDefaults = extendDefaults<ITexturedBasic>(
    [],
    {
        color: new NullableDefault("#ffffff"),
        opacity: new NullableDefault(1),
        texture: undefined,
        videoTexture: undefined,
        alphaMap: undefined,
        textureRepeat: new NullableDefault({ x: 1, y: 1 }),
        textureFlipY: new NullableDefault(false),
        textureRotation: new NullableDefault(0)
    },
    {
        opacity: new Range(0, 1),
        textureRotation: new Range(0, 360)
    }
)
