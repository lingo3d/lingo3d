import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import Choices from "./utils/Choices"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"

export type D6MotionOptions = "locked" | "limited" | "free"

export default interface ID6Joint extends IJointBase {
    linearX: D6MotionOptions
    linearLimitXLow: number
    linearLimitXHigh: number
    linearStiffnessX: number
    linearDampingX: number
    linearY: D6MotionOptions
    linearLimitYLow: number
    linearLimitYHigh: number
    linearStiffnessY: number
    linearDampingY: number
    linearZ: D6MotionOptions
    linearLimitZLow: number
    linearLimitZHigh: number
    linearStiffnessZ: number
    linearDampingZ: number
    twistX: D6MotionOptions
    twistLimitLow: number
    twistLimitHigh: number
    twistStiffness: number
    twistDamping: number
    swingY: D6MotionOptions
    swingLimitY: number
    swingZ: D6MotionOptions
    swingLimitZ: number
    swingStiffness: number
    swingDamping: number
}

export const d6JointSchema: Required<ExtractProps<ID6Joint>> = {
    ...jointBaseSchema,
    linearX: String,
    linearLimitXLow: Number,
    linearLimitXHigh: Number,
    linearStiffnessX: Number,
    linearDampingX: Number,
    linearY: String,
    linearLimitYLow: Number,
    linearLimitYHigh: Number,
    linearStiffnessY: Number,
    linearDampingY: Number,
    linearZ: String,
    linearLimitZLow: Number,
    linearLimitZHigh: Number,
    linearStiffnessZ: Number,
    linearDampingZ: Number,
    twistX: String,
    twistLimitLow: Number,
    twistLimitHigh: Number,
    twistStiffness: Number,
    twistDamping: Number,
    swingY: String,
    swingLimitY: Number,
    swingZ: String,
    swingLimitZ: Number,
    swingStiffness: Number,
    swingDamping: Number
}

export const limitRange = new Range(-200, 200)
export const stiffnessRange = new Range(0, 500)
export const dampingRange = new Range(0, 20)
export const angularLimitRange = new Range(-360, 360)
export const coneLimitRange = new Range(0, 360)

const motionChoices = new Choices({
    locked: "locked",
    limited: "limited",
    free: "free"
})
export const d6JointDefaults = extendDefaults<ID6Joint>(
    [jointBaseDefaults],
    {
        linearX: "locked",
        linearLimitXLow: -100,
        linearLimitXHigh: 100,
        linearStiffnessX: 0,
        linearDampingX: 0,
        linearY: "locked",
        linearLimitYLow: -100,
        linearLimitYHigh: 100,
        linearStiffnessY: 0,
        linearDampingY: 0,
        linearZ: "locked",
        linearLimitZLow: -100,
        linearLimitZHigh: 100,
        linearStiffnessZ: 0,
        linearDampingZ: 0,
        twistX: "locked",
        twistLimitLow: -360,
        twistLimitHigh: 360,
        twistStiffness: 0,
        twistDamping: 0,
        swingY: "locked",
        swingLimitY: 360,
        swingZ: "locked",
        swingLimitZ: 360,
        swingStiffness: 0,
        swingDamping: 0
    },
    {
        linearX: motionChoices,
        linearLimitXLow: limitRange,
        linearLimitXHigh: limitRange,
        linearStiffnessX: stiffnessRange,
        linearDampingX: dampingRange,
        linearY: motionChoices,
        linearLimitYLow: limitRange,
        linearLimitYHigh: limitRange,
        linearStiffnessY: stiffnessRange,
        linearDampingY: dampingRange,
        linearZ: motionChoices,
        linearLimitZLow: limitRange,
        linearLimitZHigh: limitRange,
        linearStiffnessZ: stiffnessRange,
        linearDampingZ: dampingRange,
        twistX: motionChoices,
        twistLimitLow: angularLimitRange,
        twistLimitHigh: angularLimitRange,
        twistStiffness: stiffnessRange,
        twistDamping: dampingRange,
        swingY: motionChoices,
        swingLimitY: coneLimitRange,
        swingZ: motionChoices,
        swingLimitZ: coneLimitRange,
        swingStiffness: stiffnessRange,
        swingDamping: dampingRange
    }
)
