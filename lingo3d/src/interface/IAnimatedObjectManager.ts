import AnimationManager from "../display/core/AnimatedObjectManager/AnimationManager"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"
import { nullableDefault } from "./utils/NullableDefault"
import IMeshAppendable, {
    meshAppendableDefaults,
    meshAppendableSchema
} from "./IMeshAppendable"

export type AnimationValue = Record<string, Array<number>>
export type Animation = string | number | boolean | AnimationValue

export default interface IAnimatedObjectManager extends IMeshAppendable {
    animations: Record<string, string | AnimationManager>
    animation: Nullable<Animation>
    animationPaused: Nullable<boolean>
}

export const animatedObjectManagerSchema: Required<
    ExtractProps<IAnimatedObjectManager>
> = {
    ...meshAppendableSchema,

    animations: Object,
    animation: [String, Number, Boolean, Object],
    animationPaused: Boolean
}

export const animatedObjectManagerDefaults =
    extendDefaults<IAnimatedObjectManager>([meshAppendableDefaults], {
        animations: {},
        animation: undefined,
        animationPaused: nullableDefault(false)
    })
