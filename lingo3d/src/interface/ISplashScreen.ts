import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import Range from "./utils/Range"

export default interface ISplashScreen extends IAppendable {
    opacity: number
    textCenter: boolean
}

export const splashScreenSchema: Required<ExtractProps<ISplashScreen>> = {
    ...appendableSchema,
    opacity: Number,
    textCenter: Boolean
}

export const splashScreenDefaults = extendDefaults<ISplashScreen>(
    [appendableDefaults],
    { opacity: 1, textCenter: false },
    { opacity: new Range(0, 1) }
)
