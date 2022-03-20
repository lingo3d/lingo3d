import ICameraMixin from "./ICameraMixin";
import IObjectManager from "./IObjectManager"

export type MouseControlMode = "orbit" | "stationary"
export type MouseControl = boolean | "drag"

export default interface ICameraBase extends IObjectManager, ICameraMixin {
    minPolarAngle: number
    maxPolarAngle: number
    mouseControl?: MouseControl
    mouseControlMode?: MouseControlMode
}