import IDirectioned, {
    directionedDefaults,
    directionedSchema
} from "./IDirectioned"
import IPositioned, {
    positionedDefaults,
    positionedSchema
} from "./IPositioned"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IPositionedDirectionedManager
    extends IPositioned,
        IDirectioned {}

export const positionedDirectionedManagerSchema: Required<
    ExtractProps<IPositionedDirectionedManager>
> = {
    ...positionedSchema,
    ...directionedSchema
}

export const positionedDirectionedManagerDefaults =
    extendDefaults<IPositionedDirectionedManager>(
        [positionedDefaults, directionedDefaults],
        {}
    )
