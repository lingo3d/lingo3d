import AnimationManager from "../display/core/SimpleObjectManager/AnimationManager"
import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"

export type AnimationValue = Record<string, Array<number>>
export type Animation = string | number | Array<string | number> | boolean | AnimationValue

export default interface IAnimation extends IEventLoop {
    animations: Record<string, string | AnimationManager>
    animation?: Animation
    animationPaused: boolean
}

export const animationSchema: Required<ExtractProps<IAnimation>> = {
    ...eventLoopSchema,
    animations: Object,
    animation: [String, Number, Array, Boolean, Object],
    animationPaused: Boolean
}

export const animationDefaults: IAnimation = {
    ...eventLoopDefaults,
    animations: {},
    animationPaused: false
}