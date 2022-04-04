import AnimationManager from "../display/core/SimpleObjectManager/AnimationManager"
import IEventLoop, { eventLoopDefaults } from "./IEventLoop"

export type AnimationValue = Record<string, Array<number>>
export type Animation = string | number | Array<string | number> | boolean | AnimationValue

export default interface IAnimation extends IEventLoop {
    animations: Record<string, string | AnimationManager>
    animation?: Animation
}

export const animationDefaults: IAnimation = {
    ...eventLoopDefaults,
    animations: {}
}