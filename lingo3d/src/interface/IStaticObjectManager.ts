import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"
import IMeshAppendable, {
    meshAppendableDefaults,
    meshAppendableSchema
} from "./IMeshAppendable"

export default interface IStaticObjectManager extends IMeshAppendable {
    name: string
    id: Nullable<string>
}

export const staticObjectManagerSchema: Required<
    ExtractProps<IStaticObjectManager>
> = {
    ...meshAppendableSchema,

    name: String,
    id: String
}

export const staticObjectManagerDefaults = extendDefaults<IStaticObjectManager>(
    [meshAppendableDefaults],
    {
        name: "",
        id: undefined
    }
)
