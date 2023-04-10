import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IDummyIK extends IAppendable {}

export const dummyIKSchema: Required<ExtractProps<IDummyIK>> = {
    ...appendableSchema
}

export const dummyIKDefaults = extendDefaults<IDummyIK>(
    [appendableDefaults],
    {}
)
