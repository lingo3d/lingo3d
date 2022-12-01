import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import Choices from "./utils/Choices"

export default interface IReticle extends IAppendable {
    variant: 1 | 2 | 3 | 4
}

export const reticleSchema: Required<ExtractProps<IReticle>> = {
    ...appendableSchema,
    variant: Number
}

export const reticleDefaults = extendDefaults<IReticle>(
    [appendableDefaults],
    { variant: 1 },
    { variant: new Choices({ 1: 1, 2: 2, 3: 3, 4: 4 }) }
)
