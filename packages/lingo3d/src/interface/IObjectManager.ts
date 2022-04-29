import ISimpleObjectManager, { simpleObjectManagerDefaults, simpleObjectManagerSchema } from "./ISimpleObjectManager"
import { ExtractProps } from "./utils/extractProps"

export default interface IObjectManager extends ISimpleObjectManager {
    innerRotationX: number
    innerRotationY: number
    innerRotationZ: number
    innerRotation: number

    innerX: number
    innerY: number
    innerZ: number
}

export const objectManagerSchema: Required<ExtractProps<IObjectManager>> = {
    ...simpleObjectManagerSchema,

    innerRotationX: Number,
    innerRotationY: Number,
    innerRotationZ: Number,
    innerRotation: Number,

    innerX: Number,
    innerY: Number,
    innerZ: Number
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