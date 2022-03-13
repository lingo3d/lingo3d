import ISimpleObjectManager from "./ISimpleObjectManager"

export default interface IObjectManager extends ISimpleObjectManager {
    innerRotationX: number
    innerRotationY: number
    innerRotationZ: number
    innerRotation: number

    innerX: number
    innerY: number
    innerZ: number
}