import IObjectManager, { objectManagerDefaults, objectManagerSchema } from "./IObjectManager"
import ITexturedBasic, { texturedBasicDefaults, texturedBasicSchema } from "./ITexturedBasic"
import ITexturedStandard, { texturedStandardDefaults, texturedStandardSchema } from "./ITexturedStandard"
import { ExtractProps } from "./utils/extractProps"

export default interface IPrimitive extends IObjectManager, ITexturedBasic, ITexturedStandard {}

export const primitiveSchema: Required<ExtractProps<IPrimitive>> = {
    ...objectManagerSchema,
    ...texturedBasicSchema,
    ...texturedStandardSchema
}

export const primitiveDefaults: IPrimitive = {
    ...objectManagerDefaults,
    ...texturedBasicDefaults,
    ...texturedStandardDefaults
}