import ILightBase, { lightBaseDefaults } from "./ILightBase"

export default interface IPointLight extends ILightBase {
    decay: number
    distance: number
    power: number
}

export const pointLightDefaults: IPointLight = {
    ...lightBaseDefaults,
    decay: 1,
    distance: 0,
    power: 12.566
}