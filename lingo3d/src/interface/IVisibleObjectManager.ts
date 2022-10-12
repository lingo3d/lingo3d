import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"

export default interface IVisibleObjectManager extends IObjectManager {
    bloom: boolean
    outline: boolean

    visible: boolean
    frustumCulled: boolean
    castShadow: boolean
    receiveShadow: boolean
}

export const visibleObjectManagerSchema: Required<
    ExtractProps<IVisibleObjectManager>
> = {
    ...objectManagerSchema,

    bloom: Boolean,
    outline: Boolean,

    visible: Boolean,
    frustumCulled: Boolean,
    castShadow: Boolean,
    receiveShadow: Boolean
}
hideSchema(["frustumCulled", "visible"])

export const visibleObjectManagerDefaults: Defaults<IVisibleObjectManager> = {
    ...objectManagerDefaults,

    bloom: false,
    outline: false,

    visible: true,
    frustumCulled: true,
    castShadow: true,
    receiveShadow: true
}
