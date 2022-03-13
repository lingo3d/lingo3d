import IObjectManager from "./IObjectManager"

export default interface ILoaded extends IObjectManager {
    src?: string
    onLoad?: () => void
    boxVisible: boolean
}