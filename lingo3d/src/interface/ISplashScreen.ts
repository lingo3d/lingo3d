import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import Nullable from "./utils/Nullable"

export default interface ISplashScreen extends IAppendable {
    innerHTML: Nullable<string>
}

export const splashScreenSchema: Required<ExtractProps<ISplashScreen>> = {
    ...appendableSchema,
    innerHTML: String
}

export const splashScreenDefaults = extendDefaults<ISplashScreen>(
    [appendableDefaults],
    {
        innerHTML: undefined
    }
)
