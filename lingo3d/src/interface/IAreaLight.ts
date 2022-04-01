import ILightBase, { lightBaseDefaults } from "./ILightBase"

export default interface IAreaLight extends ILightBase {
    power: number
}

export const areaLightDefaults: IAreaLight = {
    ...lightBaseDefaults,
    width: 1000,
    height: 1000,
    depth: 0,
    scaleZ: 0,
    power: 10 * Math.PI
}