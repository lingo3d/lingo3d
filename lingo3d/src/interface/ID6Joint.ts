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
    swingY: Nullable<D6Motion>
    swingZ: Nullable<D6Motion>
    twistLimitLow: number
    twistLimitHigh: number
    swingLimitY: number
    swingLimitZ: number
}

export const d6JointSchema: Required<ExtractProps<ID6Joint>> = {
    ...jointBaseSchema,
    slideX: String,
    slideY: String,
    slideZ: String,
    twist: String,
    swingY: String,
    swingZ: String,
    twistLimitLow: Number,
    twistLimitHigh: Number,
    swingLimitY: Number,
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
        swingY: nullableDefault("locked"),
        swingZ: nullableDefault("locked"),
        twistLimitLow: -360,
        twistLimitHigh: 360,
        swingLimitY: 360,
        swingLimitZ: 360
    },
    {
        slideX: motionChoices,
        slideY: motionChoices,
        slideZ: motionChoices,
        twist: motionChoices,
        swingY: motionChoices,
        swingZ: motionChoices,
        twistLimitLow: new Range(-360, 360),
        twistLimitHigh: new Range(-360, 360),
        swingLimitY: new Range(0, 360),
        swingLimitZ: new Range(0, 360)
    }
)
