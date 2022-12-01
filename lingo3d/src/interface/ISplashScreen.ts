import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import Range from "./utils/Range"

export default interface ISplashScreen extends IAppendable {
    innerHTML: string
    opacity: number
}

export const splashScreenSchema: Required<ExtractProps<ISplashScreen>> = {
    ...appendableSchema,
    innerHTML: String,
    opacity: Number
}

export const splashScreenDefaults = extendDefaults<ISplashScreen>(
    [appendableDefaults],
    {
        innerHTML: "",
        opacity: 0.75
    },
    { opacity: new Range(0, 1) }
)
