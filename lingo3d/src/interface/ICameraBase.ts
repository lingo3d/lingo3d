import ICameraMixin, { cameraMixinDefaults } from "./ICameraMixin";
import IObjectManager, { objectManagerDefaults } from "./IObjectManager"

export type MouseControlMode = "orbit" | "stationary"
export type MouseControl = boolean | "drag"

export default interface ICameraBase extends IObjectManager, ICameraMixin {
    minPolarAngle: number
    maxPolarAngle: number
    mouseControl?: MouseControl
    mouseControlMode?: MouseControlMode
}

export const cameraBaseDefaults: ICameraBase = {
    ...objectManagerDefaults,
    ...cameraMixinDefaults,
    minPolarAngle: 5,
    maxPolarAngle: 175
}