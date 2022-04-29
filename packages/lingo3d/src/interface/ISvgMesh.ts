import ILoaded, { loadedDefaults, loadedSchema } from "./ILoaded"
import { ExtractProps } from "./utils/extractProps"

export default interface ISvgMesh extends ILoaded {}

export const svgMeshSchema: Required<ExtractProps<ISvgMesh>> = {
    ...loadedSchema
}

export const svgMeshDefaults: ISvgMesh = {
    ...loadedDefaults
}