import IGimbalObjectManager, {
    gimbalObjectManagerDefaults,
    gimbalObjectManagerSchema
} from "./IGimbalObjectManager"
import IVisible, { visibleDefaults, visibleSchema } from "./IVisible"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IVisibleObjectManager
    extends IGimbalObjectManager,
        IVisible {
    innerVisible: boolean
}

export const visibleObjectManagerSchema: Required<
    ExtractProps<IVisibleObjectManager>
> = {
    ...gimbalObjectManagerSchema,
    ...visibleSchema,
    innerVisible: Boolean
}

export const visibleObjectManagerDefaults =
    extendDefaults<IVisibleObjectManager>(
        [gimbalObjectManagerDefaults, visibleDefaults],
        {
            innerVisible: true
        }
    )
