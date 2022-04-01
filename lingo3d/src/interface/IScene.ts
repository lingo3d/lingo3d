import ILoaded, { loadedDefaults } from "./ILoaded"

export default interface IScene extends ILoaded {}

export const sceneDefaults: IScene = {
    ...loadedDefaults
}