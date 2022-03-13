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