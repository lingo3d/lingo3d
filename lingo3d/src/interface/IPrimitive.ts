import IObjectManager, { objectManagerDefaults } from "./IObjectManager"
import ITexturedBasic, { texturedBasicDefaults } from "./ITexturedBasic"
import ITexturedStandard, { texturedStandardDefaults } from "./ITexturedStandard"

export default interface IPrimitive extends IObjectManager, ITexturedBasic, ITexturedStandard {}

export const primitiveDefaults: IPrimitive = {
    ...objectManagerDefaults,
    ...texturedBasicDefaults,
    ...texturedStandardDefaults
}