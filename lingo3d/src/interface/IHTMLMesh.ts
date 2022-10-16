import IVisibleObjectManager, {
    visibleObjectManagerDefaults,
    visibleObjectManagerSchema
} from "./IVisibleObjectManager"
import Defaults, { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Nullable from "./utils/Nullable"

export default interface IHTMLMesh extends IVisibleObjectManager {
    element: Nullable<Element>
    innerHTML: Nullable<string>
    cssColor: string
    sprite: boolean
}

export const htmlMeshSchema: Required<ExtractProps<IHTMLMesh>> = {
    ...visibleObjectManagerSchema,
    element: Object,
    innerHTML: String,
    cssColor: String,
    sprite: Boolean
}
hideSchema(["element"])

export const htmlMeshDefaults = extendDefaults<IHTMLMesh>(
    [visibleObjectManagerDefaults],
    {
        element: undefined,
        innerHTML: undefined,
        cssColor: "#ffffff",
        sprite: false
    }
)
