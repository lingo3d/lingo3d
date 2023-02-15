import AnimationManager from "../display/core/AnimatedObjectManager/AnimationManager"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"
import { nullableDefault } from "./utils/NullableDefault"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import IMeshAppendable, {
    meshAppendableDefaults,
    meshAppendableSchema
} from "./IMeshAppendable"
import { nullableCallback } from "./utils/NullableCallback"

export type AnimationValue = Record<string, Array<number>>
export type Animation =
    | string
    | number
    | Array<string | number>
    | boolean
    | AnimationValue

export default interface IAnimatedObjectManager extends IMeshAppendable {
    animations: Record<string, string | AnimationManager>
    animation: Nullable<Animation>
    animationPaused: Nullable<boolean>
    animationRepeat: Nullable<number>
    onAnimationFinish: Nullable<() => void>
}

export const animatedObjectManagerSchema: Required<
    ExtractProps<IAnimatedObjectManager>
> = {
    ...meshAppendableSchema,

    animations: Object,
    animation: [String, Number, Array, Boolean, Object],
    animationPaused: Boolean,
    animationRepeat: Number,
    onAnimationFinish: Function
}
hideSchema(["animationRepeat"])

export const animatedObjectManagerDefaults =
    extendDefaults<IAnimatedObjectManager>([meshAppendableDefaults], {
        animations: {},
        animation: undefined,
        animationPaused: nullableDefault(false),
        animationRepeat: nullableDefault(Infinity),
        onAnimationFinish: nullableCallback(undefined)
    })
