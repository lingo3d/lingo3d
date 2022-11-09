import AnimationManager from "../display/core/AnimatedObjectManager/AnimationManager"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"
import IStaticObjectManager, {
    staticObjectManagerDefaults,
    staticObjectManagerSchema
} from "./IStaticObjectManager"
import NullableDefault from "./utils/NullableDefault"
import { hideSchema } from "./utils/nonEditorSchemaSet"

export type AnimationValue = Record<string, Array<number>>
export type Animation =
    | string
    | number
    | Array<string | number>
    | boolean
    | AnimationValue

export default interface IAnimatedObjectManager extends IStaticObjectManager {
    animations: Record<string, string | AnimationManager>
    animation: Nullable<Animation>
    animationPaused: Nullable<boolean>
    animationRepeat: Nullable<number>
    onAnimationFinish: Nullable<() => void>
}

export const animatedObjectManagerSchema: Required<
    ExtractProps<IAnimatedObjectManager>
> = {
    ...staticObjectManagerSchema,

    animations: Object,
    animation: [String, Number, Array, Boolean, Object],
    animationPaused: Boolean,
    animationRepeat: Number,
    onAnimationFinish: Function
}
hideSchema(["animationRepeat"])

export const animatedObjectManagerDefaults =
    extendDefaults<IAnimatedObjectManager>([staticObjectManagerDefaults], {
        animations: {},
        animation: undefined,
        animationPaused: new NullableDefault(false),
        animationRepeat: new NullableDefault(Infinity),
        onAnimationFinish: undefined
    })
