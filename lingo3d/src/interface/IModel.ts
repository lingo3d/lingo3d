import ILoaded from "./ILoaded"

export default interface IModel extends ILoaded {
    loadedScale: number
    loadedX: number
    loadedY: number
    loadedZ: number
}