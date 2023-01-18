import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ID6Drive extends IAppendable {
    stiffness: number
    damping: number
    forceLimit: number
    isAcceleration: boolean
}

export const cylinderSchema: Required<ExtractProps<ID6Drive>> = {
    ...appendableSchema,
    stiffness: Number,
    damping: Number,
    forceLimit: Number,
    isAcceleration: Boolean
}

export const cylinderDefaults = extendDefaults<ID6Drive>([appendableDefaults], {
    stiffness: 0,
    damping: 1000,
    forceLimit: Infinity,
    isAcceleration: false
})
