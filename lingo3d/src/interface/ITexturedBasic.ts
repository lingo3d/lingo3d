import { ExtractProps } from "./utils/extractProps"

type Vector2 = { x: number, y: number }

export default interface ITexturedBasic {
    color: string
    vertexColors: boolean
    fog: boolean
    opacity: number
    texture?: string | HTMLVideoElement
    videoTexture?: string | HTMLVideoElement
    alphaMap?: string
    textureRepeat?: Vector2 | number
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
    opacity: 1
}