import ILoaded, { loadedDefaults } from "./ILoaded"
import ITexturedLoaded, { texturedLoadedDefaults } from "./ITexturedLoaded"

export default interface IModel extends ILoaded, ITexturedLoaded {
    loadedScale?: number
    loadedX?: number
    loadedY?: number
    loadedZ?: number
}

export const modelDefaults: IModel = {
    ...loadedDefaults,
    ...texturedLoadedDefaults
}