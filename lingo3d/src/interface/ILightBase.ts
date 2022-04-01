import IObjectManager, { objectManagerDefaults } from "./IObjectManager"

export default interface ILightBase extends IObjectManager {
    color: string
    intensity: number
}

export const lightBaseDefaults: ILightBase = {
    ...objectManagerDefaults,
    color: "#ffffff",
    intensity: 1
}