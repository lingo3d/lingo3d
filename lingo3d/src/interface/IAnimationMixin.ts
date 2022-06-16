import AnimationManager from "../display/core/mixins/AnimationMixin/AnimationManager"
import { ExtractProps } from "./utils/extractProps"
import fn from "./utils/fn"
import Nullable from "./utils/Nullable"

export type AnimationValue = Record<string, Array<number>>
export type Animation = string | number | Array<string | number> | boolean | AnimationValue

export default interface IAnimationMixin {
    animations: Record<string, string | AnimationManager>
    animation: Nullable<Animation>
    animationPaused: Nullable<boolean>
    animationRepeat: Nullable<boolean>
    onAnimationFinish: Nullable<() => void>
}

export const animationMixinSchema: Required<ExtractProps<IAnimationMixin>> = {
    animations: Object,
    animation: [String, Number, Array, Boolean, Object],
    animationPaused: Boolean,
    animationRepeat: Boolean,
    onAnimationFinish: Function
}

export const animationMixinDefaults: IAnimationMixin = {
    animations: {},
    animation: undefined,
    animationPaused: undefined,
    animationRepeat: undefined,
    onAnimationFinish: undefined
}

export const animationMixinRequiredDefaults: IAnimationMixin = {
    ...animationMixinDefaults,
    animation: "",
    animationPaused: false,
    animationRepeat: true,
    onAnimationFinish: fn
}