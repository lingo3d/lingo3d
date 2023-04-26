import ILoaded, { loadedDefaults, loadedSchema } from "./ILoaded"
import ITexturedStandard, {
    texturedStandardDefaults,
    texturedStandardSchema
} from "./ITexturedStandard"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface ISvgMesh extends ILoaded, ITexturedStandard {}

export const svgMeshSchema: Required<ExtractProps<ISvgMesh>> = {
    ...loadedSchema,
    ...texturedStandardSchema
}

export const svgMeshDefaults = extendDefaults<ISvgMesh>(
    [loadedDefaults, texturedStandardDefaults],
    {}
)
