import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import ISimpleObjectManager, {
    simpleObjectManagerDefaults,
    simpleObjectManagerSchema
} from "./ISimpleObjectManager"

export default interface IGimbalObjectManager extends ISimpleObjectManager {
    innerRotationX: number
    innerRotationY: number
    innerRotationZ: number

    innerX: number
    innerY: number
    innerZ: number

    width: number
    height: number
    depth: number
}

export const gimbalObjectManagerSchema: Required<
    ExtractProps<IGimbalObjectManager>
> = {
    ...simpleObjectManagerSchema,

    innerRotationX: Number,
    innerRotationY: Number,
    innerRotationZ: Number,

    innerX: Number,
    innerY: Number,
    innerZ: Number,

    width: Number,
    height: Number,
    depth: Number
}

export const gimbalObjectManagerDefaults = extendDefaults<IGimbalObjectManager>(
    [simpleObjectManagerDefaults],
    {
        innerRotationX: 0,
        innerRotationY: 0,
        innerRotationZ: 0,

        innerX: 0,
        innerY: 0,
        innerZ: 0,

        width: 100,
        height: 100,
        depth: 100
    },
    {
        innerRotationX: new Range(0, 360),
        innerRotationY: new Range(0, 360),
        innerRotationZ: new Range(0, 360),
        innerX: new Range(-1000, 1000),
        innerY: new Range(-1000, 1000),
        innerZ: new Range(-1000, 1000),
        width: new Range(0, 1000),
        height: new Range(0, 1000),
        depth: new Range(0, 1000)
    }
)
