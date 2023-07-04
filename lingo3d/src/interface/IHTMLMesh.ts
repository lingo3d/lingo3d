import { editorHideSet } from "../collections/editorHideSet"
import { ColorString } from "./ITexturedStandard"
import IVisibleObjectManager, {
    visibleObjectManagerDefaults,
    visibleObjectManagerSchema
} from "./IVisibleObjectManager"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IHTMLMesh extends IVisibleObjectManager {
    element: Nullable<Element>
    innerHTML: Nullable<string>
    cssColor: ColorString
    sprite: boolean
}

export const htmlMeshSchema: Required<ExtractProps<IHTMLMesh>> = {
    ...visibleObjectManagerSchema,
    element: Object,
    innerHTML: String,
    cssColor: String,
    sprite: Boolean
}
editorHideSet.add("element")

export const htmlMeshDefaults = extendDefaults<IHTMLMesh>(
    [visibleObjectManagerDefaults],
    {
        element: undefined,
        innerHTML: undefined,
        cssColor: "#ffffff",
        sprite: false
    }
)
