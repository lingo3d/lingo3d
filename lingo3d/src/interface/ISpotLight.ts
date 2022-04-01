import ILightBase, { lightBaseDefaults } from "./ILightBase"

export default interface ISpotLight extends ILightBase {
    angle: number
    penumbra: number
}

export const spotLightDefaults: ISpotLight = {
    ...lightBaseDefaults,
    angle: 1,
    penumbra: 0
}