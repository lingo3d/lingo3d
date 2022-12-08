import ILoaded, { loadedDefaults, loadedSchema } from "./ILoaded"
import ITexturedBasic, {
    texturedBasicDefaults,
    texturedBasicSchema
} from "./ITexturedBasic"
import ITexturedStandard, {
    texturedStandardDefaults,
    texturedStandardSchema
} from "./ITexturedStandard"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Nullable from "./utils/Nullable"

export default interface ISvgMesh
    extends ILoaded,
        ITexturedBasic,
        ITexturedStandard {
    innerHTML: Nullable<string>
}

export const svgMeshSchema: Required<ExtractProps<ISvgMesh>> = {
    ...loadedSchema,
    ...texturedBasicSchema,
    ...texturedStandardSchema,
    innerHTML: String
}

export const svgMeshDefaults = extendDefaults<ISvgMesh>(
    [loadedDefaults, texturedBasicDefaults, texturedStandardDefaults],
    { innerHTML: undefined }
)
