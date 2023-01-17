import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import Choices from "./utils/Choices"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { nullableDefault } from "./utils/NullableDefault"
import Range from "./utils/Range"

export type D6Motion = "locked" | "limited" | "free"

export default interface ID6Joint extends IJointBase {
    slideX: Nullable<D6Motion>
    slideY: Nullable<D6Motion>
    slideZ: Nullable<D6Motion>
    twist: Nullable<D6Motion>
    twistLimitLow: number
    twistLimitHigh: number
    swingY: Nullable<D6Motion>
    swingLimitY: number
    swingZ: Nullable<D6Motion>
    swingLimitZ: number
}

export const d6JointSchema: Required<ExtractProps<ID6Joint>> = {
    ...jointBaseSchema,
    slideX: String,
    slideY: String,
    slideZ: String,
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
        slideX: nullableDefault("locked"),
        slideY: nullableDefault("locked"),
        slideZ: nullableDefault("locked"),
        twist: nullableDefault("locked"),
        twistLimitLow: -360,
        twistLimitHigh: 360,
        swingY: nullableDefault("locked"),
        swingLimitY: 360,
        swingZ: nullableDefault("locked"),
        swingLimitZ: 360
    },
    {
        slideX: motionChoices,
        slideY: motionChoices,
        slideZ: motionChoices,
        twist: motionChoices,
        twistLimitLow: new Range(-360, 360),
        twistLimitHigh: new Range(-360, 360),
        swingY: motionChoices,
        swingLimitY: new Range(0, 360),
        swingZ: motionChoices,
        swingLimitZ: new Range(0, 360)
    }
)
