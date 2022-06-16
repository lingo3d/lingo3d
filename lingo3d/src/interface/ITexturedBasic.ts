import { Point } from "@lincode/math"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface ITexturedBasic {
    color: string
    vertexColors: boolean
    fog: boolean
    opacity: number
    texture: Nullable<string | HTMLVideoElement>
    videoTexture: Nullable<string | HTMLVideoElement>
    alphaMap: Nullable<string>
    textureRepeat: Nullable<Point | number>
}

export const texturedBasicSchema: Required<ExtractProps<ITexturedBasic>> = {
    color: String,
    vertexColors: Boolean,
    fog: Boolean,
    opacity: Number,
    texture: [String, Object],
    videoTexture: [String, Object],
    alphaMap: String,
    textureRepeat: [Object, Number]
}

export const texturedBasicDefaults: ITexturedBasic = {
    color: "#ffffff",
    vertexColors: false,
    fog: true,
    opacity: 1,
    texture: undefined,
    videoTexture: undefined,
    alphaMap: undefined,
    textureRepeat: undefined
}

export const texturedBasicRequiredDefaults: ITexturedBasic = {
    color: "#ffffff",
    vertexColors: false,
    fog: true,
    opacity: 1,
    texture: "",
    videoTexture: "",
    alphaMap: "",
    textureRepeat: { x: 1, y: 1 }
}