import AnimationManager from "../display/core/SimpleObjectManager/AnimationManager"
import IPositioned, { positionedDefaults, positionedSchema } from "./IPositioned"
import { ExtractProps } from "./utils/extractProps"

export type AnimationValue = Record<string, Array<number>>
export type Animation = string | number | Array<string | number> | boolean | AnimationValue

export default interface IAnimation extends IPositioned {
    animations: Record<string, string | AnimationManager>
    animation?: Animation
    animationPaused: boolean
}

export const animationSchema: Required<ExtractProps<IAnimation>> = {
    ...positionedSchema,
    animations: Object,
    animation: [String, Number, Array, Boolean, Object],
    animationPaused: Boolean
}

export const animationDefaults: IAnimation = {
    ...positionedDefaults,
    animations: {},
    animationPaused: false
}