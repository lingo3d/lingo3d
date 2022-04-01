import IObjectManager, { objectManagerDefaults } from "./IObjectManager"

export default interface ILoaded extends IObjectManager {
    src?: string
    onLoad?: () => void
    boxVisible: boolean
}

export const loadedDefaults: ILoaded = {
    ...objectManagerDefaults,
    boxVisible: false
}