import IAnimatedObjectManager, {
    animatedObjectManagerDefaults,
    animatedObjectManagerSchema
} from "./IAnimatedObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"

export default interface ISimpleObjectManager extends IAnimatedObjectManager {
    scaleX: number
    scaleY: number
    scaleZ: number
    scale: number
}

export const simpleObjectManagerSchema: Required<
    ExtractProps<ISimpleObjectManager>
> = {
    ...animatedObjectManagerSchema,
    scaleX: Number,
    scaleY: Number,
    scaleZ: Number,
    scale: Number
}

export const simpleObjectManagerDefaults = extendDefaults<ISimpleObjectManager>(
    [animatedObjectManagerDefaults],
    {
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        scale: 1
    },
    {
        scale: new Range(0, 10),
        scaleX: new Range(0, 10),
        scaleY: new Range(0, 10),
        scaleZ: new Range(0, 10)
    }
)
