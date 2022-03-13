import AnimationManager from "../display/core/SimpleObjectManager/AnimationManager"
import IEventLoop from "./IEventLoop"

export type AnimationValue = Record<string, Array<number>>

export default interface IAnimation extends IEventLoop {
    animations: Record<string, string | AnimationManager>
    animation?: string | AnimationValue
}