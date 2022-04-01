import ILightBase, { lightBaseDefaults } from "./ILightBase"

export default interface ILight extends ILightBase {}

export const lightDefaults: ILight = {
    ...lightBaseDefaults
}