import Appendable from "../display/core/Appendable"
import { disableSchema } from "../collections/disableSchema"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IAppendable {
    onLoop: Nullable<() => void>
    proxy: Nullable<Appendable>
    uuid: string
    id: Nullable<string>
    name: Nullable<string>
    runtimeData: Nullable<Record<string, any>>
    systems: Array<string>
}

export const appendableSchema: Required<ExtractProps<IAppendable>> = {
    onLoop: Function,
    proxy: Object,
    uuid: String,
    id: String,
    name: String,
    runtimeData: Object,
    systems: Array
}
for (const key of ["proxy", "runtimeData", "uuid", "systems"])
    disableSchema.add(key)

export const appendableDefaults = extendDefaults<IAppendable>([], {
    onLoop: undefined,
    proxy: undefined,
    uuid: "",
    id: undefined,
    name: undefined,
    runtimeData: undefined,
    systems: []
})
