import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import Choices from "./utils/Choices"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"

export type D6MotionOptions = "locked" | "limited" | "free"

export default interface ID6Joint extends IJointBase {
    linearX: D6MotionOptions
    linearLimitX: number
    linearStiffnessX: number
    linearDampingX: number
    linearY: D6MotionOptions
    linearLimitY: number
    linearStiffnessY: number
    linearDampingY: number
    linearZ: D6MotionOptions
    linearLimitZ: number
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
    linearLimitX: Number,
    linearStiffnessX: Number,
    linearDampingX: Number,
    linearY: String,
    linearLimitY: Number,
    linearStiffnessY: Number,
    linearDampingY: Number,
    linearZ: String,
    linearLimitZ: Number,
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
        linearStiffnessX: 0,
        linearDampingX: 0,
        linearY: "locked",
        linearLimitY: 100,
        linearStiffnessY: 0,
        linearDampingY: 0,
        linearZ: "locked",
        linearLimitZ: 100,
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
        linearLimitX: new Range(0, 200),
        linearStiffnessX: new Range(0, 500),
        linearDampingX: new Range(0, 20),
        linearY: motionChoices,
        linearLimitY: new Range(0, 200),
        linearStiffnessY: new Range(0, 500),
        linearDampingY: new Range(0, 20),
        linearZ: motionChoices,
        linearLimitZ: new Range(0, 200),
        linearStiffnessZ: new Range(0, 500),
        linearDampingZ: new Range(0, 20),
        twistX: motionChoices,
        twistLimitLow: new Range(-360, 360),
        twistLimitHigh: new Range(-360, 360),
        twistStiffness: new Range(0, 500),
        twistDamping: new Range(0, 20),
        swingY: motionChoices,
        swingLimitY: new Range(0, 360),
        swingZ: motionChoices,
        swingLimitZ: new Range(0, 360),
        swingStiffness: new Range(0, 500),
        swingDamping: new Range(0, 20)
    }
)
