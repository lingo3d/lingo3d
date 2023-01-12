import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import IVisible, { visibleDefaults, visibleSchema } from "./IVisible"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IVisibleObjectManager
    extends IObjectManager,
        IVisible {
    innerVisible: boolean
}

export const visibleObjectManagerSchema: Required<
    ExtractProps<IVisibleObjectManager>
> = {
    ...objectManagerSchema,
    ...visibleSchema,
    innerVisible: Boolean
}

export const visibleObjectManagerDefaults =
    extendDefaults<IVisibleObjectManager>(
        [objectManagerDefaults, visibleDefaults],
        {
            innerVisible: true
        }
    )
