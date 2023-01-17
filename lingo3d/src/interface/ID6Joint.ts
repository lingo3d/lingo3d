import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import Choices from "./utils/Choices"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { nullableDefault } from "./utils/NullableDefault"
import Range from "./utils/Range"

export type D6Motion = "locked" | "limited" | "free"

export default interface ID6Joint extends IJointBase {
    distanceX: Nullable<D6Motion>
    distanceY: Nullable<D6Motion>
    distanceZ: Nullable<D6Motion>
    swingY: Nullable<D6Motion>
    swingLimitY: number
    swingZ: Nullable<D6Motion>
    swingLimitZ: number
    twist: Nullable<D6Motion>
    twistLimitLow: number
    twistLimitHigh: number
}

export const d6JointSchema: Required<ExtractProps<ID6Joint>> = {
    ...jointBaseSchema,
    distanceX: String,
    distanceY: String,
    distanceZ: String,
    swingY: String,
    swingLimitY: Number,
    swingZ: String,
    swingLimitZ: Number,
    twist: String,
    twistLimitLow: Number,
    twistLimitHigh: Number
}

const motionChoices = new Choices({
    locked: "locked",
    limited: "limited",
    free: "free"
})
export const d6JointDefaults = extendDefaults<ID6Joint>(
    [jointBaseDefaults],
    {
        distanceX: nullableDefault("locked"),
        distanceY: nullableDefault("locked"),
        distanceZ: nullableDefault("locked"),
        swingY: nullableDefault("locked"),
        swingLimitY: 360,
        swingZ: nullableDefault("locked"),
        swingLimitZ: 360,
        twist: nullableDefault("locked"),
        twistLimitLow: -360,
        twistLimitHigh: 360
    },
    {
        distanceX: motionChoices,
        distanceY: motionChoices,
        distanceZ: motionChoices,
        swingY: motionChoices,
        swingLimitY: new Range(0, 360),
        swingZ: motionChoices,
        swingLimitZ: new Range(0, 360),
        twist: motionChoices,
        twistLimitLow: new Range(-360, 360),
        twistLimitHigh: new Range(-360, 360)
    }
)
