import Appendable from "../api/core/Appendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Nullable from "./utils/Nullable"

export default interface IAppendable {
    uuid: string
    onLoop: Nullable<() => void>
    proxy: Nullable<Appendable>
}

export const appendableSchema: Required<ExtractProps<IAppendable>> = {
    uuid: String,
    onLoop: Function,
    proxy: Object
}
hideSchema(["proxy", "uuid"])

export const appendableDefaults = extendDefaults<IAppendable>([], {
    uuid: "",
    onLoop: undefined,
    proxy: undefined
})
