import IDirectioned, {
    directionedDefaults,
    directionedSchema
} from "./IDirectioned"
import IMeshAppendable, {
    meshAppendableDefaults,
    meshAppendableSchema
} from "./IMeshAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IPositionedDirectionedManager
    extends IMeshAppendable,
        IDirectioned {}

export const positionedDirectionedManagerSchema: Required<
    ExtractProps<IPositionedDirectionedManager>
> = {
    ...meshAppendableSchema,
    ...directionedSchema
}

export const positionedDirectionedManagerDefaults =
    extendDefaults<IPositionedDirectionedManager>(
        [meshAppendableDefaults, directionedDefaults],
        {}
    )
