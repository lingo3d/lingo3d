import IObjectManager from "./IObjectManager"

export type ReflectorShape = "plane" | "circle"

export default interface IReflector extends IObjectManager {
    shape?: ReflectorShape
    contrast: number
    blur: number
}