import { ExtractProps } from "./utils/extractProps"

type Vector2 = { x: number, y: number }

export default interface ITexturedBasic {
    color: string
    vertexColors: boolean
    fog: boolean
    opacity: number
    texture?: string | Array<string>
    alphaMap?: string
    textureRepeat?: Vector2 | number
}

export const texturedBasicSchema: Required<ExtractProps<ITexturedBasic>> = {
    color: String,
    vertexColors: Boolean,
    fog: Boolean,
    opacity: Number,
    texture: [String, Array] as any,
    alphaMap: String,
    textureRepeat: [Object, Number] as any
}

export const texturedBasicDefaults: ITexturedBasic = {
    color: "#ffffff",
    vertexColors: false,
    fog: true,
    opacity: 1
}