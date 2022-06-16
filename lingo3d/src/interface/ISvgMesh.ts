import ILoaded, { loadedDefaults, loadedSchema } from "./ILoaded"
import ITexturedBasic, { texturedBasicDefaults, texturedBasicSchema } from "./ITexturedBasic"
import ITexturedStandard, { texturedStandardDefaults, texturedStandardSchema } from "./ITexturedStandard"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ISvgMesh extends ILoaded, ITexturedBasic, ITexturedStandard {}

export const svgMeshSchema: Required<ExtractProps<ISvgMesh>> = {
    ...loadedSchema,
    ...texturedBasicSchema,
    ...texturedStandardSchema
}

export const svgMeshDefaults: Defaults<ISvgMesh> = {
    ...loadedDefaults,
    ...texturedBasicDefaults,
    ...texturedStandardDefaults
}