import ICameraMixin from "./ICameraMixin";
import IObjectManager from "./IObjectManager"

export type MouseControlMode = "orbit" | "stationary"

export default interface ICameraBase extends IObjectManager, ICameraMixin {
    mouseControl: boolean
    minPolarAngle: number
    maxPolarAngle: number
    mouseControlMode?: MouseControlMode
}