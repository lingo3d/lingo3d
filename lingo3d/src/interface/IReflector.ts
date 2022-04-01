import IObjectManager, { objectManagerDefaults } from "./IObjectManager"

export type ReflectorShape = "plane" | "circle"

export default interface IReflector extends IObjectManager {
    shape?: ReflectorShape
    contrast: number
    blur: number
}

export const reflectorDefaults: IReflector = {
    ...objectManagerDefaults,
    contrast: 0.5,
    blur: 2
}