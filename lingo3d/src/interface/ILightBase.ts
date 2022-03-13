import IObjectManager from "./IObjectManager"

export default interface ILightBase extends IObjectManager {
    color: string
    intensity: number
}