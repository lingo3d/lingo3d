import { Point } from "@lincode/math"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface ITexturedBasic {
    color: string
    fog: boolean
    opacity: number
    texture: Nullable<string | HTMLVideoElement>
    videoTexture: Nullable<string | HTMLVideoElement>
    alphaMap: Nullable<string>
    textureRepeat: Nullable<Point | number>
}

export const texturedBasicSchema: Required<ExtractProps<ITexturedBasic>> = {
    color: String,
    fog: Boolean,
    opacity: Number,
    texture: [String, Object],
    videoTexture: [String, Object],
    alphaMap: String,
    textureRepeat: [Object, Number]
}

export const texturedBasicDefaults: Defaults<ITexturedBasic> = {
    color: "#ffffff",
    fog: true,
    opacity: 1,
    texture: undefined,
    videoTexture: undefined,
    alphaMap: undefined,
    textureRepeat: [undefined, { x: 1, y: 1 }]
}