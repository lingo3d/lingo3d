import ILight, { lightDefaults } from "./ILight"

export default interface IAmbientLight extends ILight {}

export const ambientLightDefaults: IAmbientLight = {
    ...lightDefaults
}