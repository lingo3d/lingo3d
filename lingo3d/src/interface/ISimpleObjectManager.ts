import IAnimatedObjectManager, {
    animatedObjectManagerDefaults,
    animatedObjectManagerSchema
} from "./IAnimatedObjectManager"
import IPositioned, {
    positionedDefaults,
    positionedSchema
} from "./IPositioned"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import IDirectioned, {
    directionedDefaults,
    directionedSchema
} from "./IDirectioned"

export default interface ISimpleObjectManager
    extends IAnimatedObjectManager,
        IPositioned,
        IDirectioned {
    scaleX: number
    scaleY: number
    scaleZ: number
    scale: number
}
hideSchema(["rotation"])

export const simpleObjectManagerSchema: Required<
    ExtractProps<ISimpleObjectManager>
> = {
    ...animatedObjectManagerSchema,
    ...positionedSchema,
    ...directionedSchema,

    scaleX: Number,
    scaleY: Number,
    scaleZ: Number,
    scale: Number
}

export const simpleObjectManagerDefaults = extendDefaults<ISimpleObjectManager>(
    [animatedObjectManagerDefaults, positionedDefaults, directionedDefaults],
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
