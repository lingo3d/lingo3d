import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import IPositioned, {
    positionedDefaults,
    positionedSchema
} from "./IPositioned"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IPositionedObjectManager
    extends IAppendable,
        IPositioned {}

export const PositionedObjectManagerSchema: Required<
    ExtractProps<IPositionedObjectManager>
> = {
    ...appendableSchema,
    ...positionedSchema
}

export const PositionedObjectManagerDefaults =
    extendDefaults<IPositionedObjectManager>(
        [appendableDefaults, positionedDefaults],
        {}
    )
