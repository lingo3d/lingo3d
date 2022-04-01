import ILoaded, { loadedDefaults } from "./ILoaded"

export default interface IModel extends ILoaded {
    loadedScale?: number
    loadedX?: number
    loadedY?: number
    loadedZ?: number
}

export const modelDefaults: IModel = {
    ...loadedDefaults
}