import ICameraBase, { cameraBaseDefaults } from "./ICameraBase"

export default interface ICamera extends ICameraBase {}

export const cameraDefaults: ICamera = {
    ...cameraBaseDefaults
}