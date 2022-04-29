import ILoaded, { loadedDefaults, loadedSchema } from "./ILoaded"
import { ExtractProps } from "./utils/extractProps"

export default interface IScene extends ILoaded {}

export const sceneSchema: Required<ExtractProps<IScene>> = {
    ...loadedSchema
}

export const sceneDefaults: IScene = {
    ...loadedDefaults
}