import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Nullable from "./utils/Nullable"

export default interface IHTMLMesh extends IObjectManager {
    element: Nullable<Element>
    innerHTML: Nullable<string>
    cssColor: string
    sprite: boolean
}

export const htmlMeshSchema: Required<ExtractProps<IHTMLMesh>> = {
    ...objectManagerSchema,
    element: Object,
    innerHTML: String,
    cssColor: String,
    sprite: Boolean
}
hideSchema(["element"])

export const htmlMeshDefaults: Defaults<IHTMLMesh> = {
    ...objectManagerDefaults,
    element: undefined,
    innerHTML: undefined,
    cssColor: "#ffffff",
    sprite: false
}
