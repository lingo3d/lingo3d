import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IHTMLMesh extends IObjectManager {
    element: Nullable<Element>
    sprite: boolean
}

export const htmlMeshSchema: Required<ExtractProps<IHTMLMesh>> = {
    ...objectManagerSchema,
    element: Object,
    sprite: Boolean
}

export const htmlMeshDefaults: Defaults<IHTMLMesh> = {
    ...objectManagerDefaults,
    element: undefined,
    sprite: false
}
