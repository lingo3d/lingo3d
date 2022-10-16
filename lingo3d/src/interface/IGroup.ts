import IVisibleObjectManager, {
    visibleObjectManagerDefaults,
    visibleObjectManagerSchema
} from "./IVisibleObjectManager"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IGroup extends IVisibleObjectManager {}

export const groupSchema: Required<ExtractProps<IGroup>> = {
    ...visibleObjectManagerSchema
}

export const groupDefaults = extendDefaults<IGroup>(
    [visibleObjectManagerDefaults],
    {}
)
