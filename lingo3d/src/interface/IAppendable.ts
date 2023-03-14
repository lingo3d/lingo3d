import Appendable from "../api/core/Appendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Nullable from "./utils/Nullable"
import {
    nullableCallback,
    nullableCallbackNumberParam
} from "./utils/NullableCallback"

export default interface IAppendable {
    onLoop: Nullable<(dt: number) => void>
    proxy: Nullable<Appendable>
    uuid: string
    id: Nullable<string>
    name: Nullable<string>
    runtimeData: Nullable<Record<string, any>>
}

export const appendableSchema: Required<ExtractProps<IAppendable>> = {
    onLoop: Function,
    proxy: Object,
    uuid: String,
    id: String,
    name: String,
    runtimeData: Object
}
hideSchema(["proxy", "runtimeData", "uuid"])

export const appendableDefaults = extendDefaults<IAppendable>([], {
    onLoop: nullableCallback(nullableCallbackNumberParam),
    proxy: undefined,
    uuid: "",
    id: undefined,
    name: undefined,
    runtimeData: undefined
})
