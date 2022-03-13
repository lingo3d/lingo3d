import ILightBase from "./ILightBase"

export default interface ISpotLight extends ILightBase {
    angle: number
    penumbra: number
}