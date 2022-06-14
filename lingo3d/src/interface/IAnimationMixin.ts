import AnimationManager from "../display/core/mixins/AnimationMixin/AnimationManager"
import { ExtractProps } from "./utils/extractProps"

export type AnimationValue = Record<string, Array<number>>
export type Animation = string | number | Array<string | number> | boolean | AnimationValue

export default interface IAnimationMixin {
    animations: Record<string, string | AnimationManager>
    animation?: Animation
    animationPaused: boolean
}

export const animationMixinSchema: Required<ExtractProps<IAnimationMixin>> = {
    animations: Object,
    animation: [String, Number, Array, Boolean, Object],
    animationPaused: Boolean
}

export const animationMixinDefaults: IAnimationMixin = {
    animations: {},
    animationPaused: false
}