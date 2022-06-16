import IObjectManager, { objectManagerDefaults, objectManagerSchema } from "./IObjectManager"
import ITexturedBasic, { texturedBasicDefaults, texturedBasicSchema } from "./ITexturedBasic"
import ITexturedStandard, { texturedStandardDefaults, texturedStandardSchema } from "./ITexturedStandard"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IPrimitive extends IObjectManager, ITexturedBasic, ITexturedStandard {}

export const primitiveSchema: Required<ExtractProps<IPrimitive>> = {
    ...objectManagerSchema,
    ...texturedBasicSchema,
    ...texturedStandardSchema
}

export const primitiveDefaults: Defaults<IPrimitive> = {
    ...objectManagerDefaults,
    ...texturedBasicDefaults,
    ...texturedStandardDefaults
}