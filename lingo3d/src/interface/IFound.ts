import ISimpleObjectManager, { simpleObjectManagerDefaults, simpleObjectManagerSchema } from "./ISimpleObjectManager"
import ITexturedBasic, { texturedBasicDefaults, texturedBasicSchema } from "./ITexturedBasic"
import ITexturedStandard, { texturedStandardDefaults, texturedStandardSchema } from "./ITexturedStandard"
import { ExtractProps } from "./utils/extractProps"

export default interface IFound extends ISimpleObjectManager, ITexturedBasic, ITexturedStandard {}

export const FoundSchema: Required<ExtractProps<IFound>> = {
    ...simpleObjectManagerSchema,
    ...texturedBasicSchema,
    ...texturedStandardSchema
}

export const FoundDefaults: IFound = {
    ...simpleObjectManagerDefaults,
    ...texturedBasicDefaults,
    ...texturedStandardDefaults
}