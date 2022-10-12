import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import IVisible, { visibleDefaults, visibleSchema } from "./IVisible"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"

export default interface IVisibleObjectManager
    extends IObjectManager,
        IVisible {}

export const visibleObjectManagerSchema: Required<
    ExtractProps<IVisibleObjectManager>
> = {
    ...objectManagerSchema,
    ...visibleSchema
}
hideSchema(["frustumCulled", "visible"])

export const visibleObjectManagerDefaults =
    extendDefaults<IVisibleObjectManager>([
        objectManagerDefaults,
        visibleDefaults
    ])
