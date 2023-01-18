import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import Choices from "./utils/Choices"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"

export type D6MotionOptions = "locked" | "limited" | "free"

export default interface ID6Joint extends IJointBase {
    linearX: D6MotionOptions
    linearLimitX: number
    linearY: D6MotionOptions
    linearLimitY: number
    linearZ: D6MotionOptions
    linearLimitZ: number
    twist: D6MotionOptions
    twistLimitLow: number
    twistLimitHigh: number
    swingY: D6MotionOptions
    swingLimitY: number
    swingZ: D6MotionOptions
    swingLimitZ: number
}

export const d6JointSchema: Required<ExtractProps<ID6Joint>> = {
    ...jointBaseSchema,
    linearX: String,
    linearLimitX: Number,
    linearY: String,
    linearLimitY: Number,
    linearZ: String,
    linearLimitZ: Number,
    twist: String,
    twistLimitLow: Number,
    twistLimitHigh: Number,
    swingY: String,
    swingLimitY: Number,
    swingZ: String,
    swingLimitZ: Number
}

const motionChoices = new Choices({
    locked: "locked",
    limited: "limited",
    free: "free"
})
export const d6JointDefaults = extendDefaults<ID6Joint>(
    [jointBaseDefaults],
    {
        linearX: "locked",
        linearLimitX: 100,
        linearY: "locked",
        linearLimitY: 100,
        linearZ: "locked",
        linearLimitZ: 100,
        twist: "locked",
        twistLimitLow: -360,
        twistLimitHigh: 360,
        swingY: "locked",
        swingLimitY: 360,
        swingZ: "locked",
        swingLimitZ: 360
    },
    {
        linearX: motionChoices,
        linearLimitX: new Range(0, 200),
        linearY: motionChoices,
        linearLimitY: new Range(0, 200),
        linearZ: motionChoices,
        linearLimitZ: new Range(0, 200),
        twist: motionChoices,
        twistLimitLow: new Range(-360, 360),
        twistLimitHigh: new Range(-360, 360),
        swingY: motionChoices,
        swingLimitY: new Range(0, 360),
        swingZ: motionChoices,
        swingLimitZ: new Range(0, 360)
    }
)
