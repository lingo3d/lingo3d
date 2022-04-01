import ILightBase, { lightBaseDefaults } from "./ILightBase"

export default interface IAreaLight extends ILightBase {
    power: number
}

export const areaLightDefaults: IAreaLight = {
    ...lightBaseDefaults,
    power: Math.PI * 10
}