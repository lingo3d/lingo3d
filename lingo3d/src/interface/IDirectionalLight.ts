import ILight, { lightDefaults } from "./ILight"

export default interface IDirectionalLight extends ILight {}

export const directionalLightDefaults: IDirectionalLight = {
    ...lightDefaults
}