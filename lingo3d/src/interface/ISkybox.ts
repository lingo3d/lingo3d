import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"
import { EnvironmentPreset } from "./IEnvironment"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"

export default interface ISkybox extends IAppendable {
    texture: Nullable<string | EnvironmentPreset | Array<string>>
}

export const skyboxSchema: Required<ExtractProps<ISkybox>> = {
    ...appendableSchema,
    texture: [String, Array]
}

export const skyboxDefaults = extendDefaults<ISkybox>([appendableDefaults], {
    texture: undefined
})
