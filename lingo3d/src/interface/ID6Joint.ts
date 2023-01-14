import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ID6Joint extends IJointBase {}

export const d6JointSchema: Required<ExtractProps<ID6Joint>> = {
    ...jointBaseSchema
}

export const d6JointDefaults = extendDefaults<ID6Joint>([jointBaseDefaults], {})
