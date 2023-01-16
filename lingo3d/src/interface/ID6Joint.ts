import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"

export default interface ID6Joint extends IJointBase {
    distanceLimit: Nullable<number>
}

export const d6JointSchema: Required<ExtractProps<ID6Joint>> = {
    ...jointBaseSchema,
    distanceLimit: Number
}

export const d6JointDefaults = extendDefaults<ID6Joint>([jointBaseDefaults], {
    distanceLimit: new NullableDefault(0)
})
