import ILightBase from "./ILightBase"

export default interface IPointLight extends ILightBase {
    decay: number
    distance: number
    power: number
}