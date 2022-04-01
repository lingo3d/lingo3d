import ISimpleObjectManager, { simpleObjectManagerDefaults } from "./ISimpleObjectManager"

export default interface IObjectManager extends ISimpleObjectManager {
    innerRotationX: number
    innerRotationY: number
    innerRotationZ: number
    innerRotation: number

    innerX: number
    innerY: number
    innerZ: number
}

export const objectManagerDefaults: IObjectManager = {
    ...simpleObjectManagerDefaults,
    
    innerRotationX: 0,
    innerRotationY: 0,
    innerRotationZ: 0,
    innerRotation: 0,

    innerX: 0,
    innerY: 0,
    innerZ: 0
}