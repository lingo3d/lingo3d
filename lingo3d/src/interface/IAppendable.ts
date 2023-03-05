import Appendable from "../api/core/Appendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Nullable from "./utils/Nullable"
import { nullableCallback } from "./utils/NullableCallback"

export default interface IAppendable {
    onLoop: Nullable<() => void>
    proxy: Nullable<Appendable>
    uuid: string
    id: Nullable<string>
    name: Nullable<string>
}

export const appendableSchema: Required<ExtractProps<IAppendable>> = {
    onLoop: Function,
    proxy: Object,
    uuid: String,
    id: String,
    name: String
}
hideSchema(["proxy"])

export const appendableDefaults = extendDefaults<IAppendable>([], {
    onLoop: nullableCallback(),
    proxy: undefined,
    uuid: "",
    id: undefined,
    name: undefined
})
