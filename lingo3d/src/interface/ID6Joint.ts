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
    twistX: Nullable<D6Motion>
    swingY: Nullable<D6Motion>
    swingZ: Nullable<D6Motion>
    swingLimitY: number
    swingLimitZ: number
    twistLimitY: number
    twistLimitZ: number
}

export const d6JointSchema: Required<ExtractProps<ID6Joint>> = {
    ...jointBaseSchema,
    slideX: String,
    slideY: String,
    slideZ: String,
    twistX: String,
    swingY: String,
    swingZ: String,
    swingLimitY: Number,
    swingLimitZ: Number,
    twistLimitY: Number,
    twistLimitZ: Number
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
        twistX: nullableDefault("locked"),
        swingY: nullableDefault("locked"),
        swingZ: nullableDefault("locked"),
        swingLimitY: 360,
        swingLimitZ: 360,
        twistLimitY: 360,
        twistLimitZ: 360
    },
    {
        slideX: motionChoices,
        slideY: motionChoices,
        slideZ: motionChoices,
        twistX: motionChoices,
        swingY: motionChoices,
        swingZ: motionChoices,
        swingLimitY: new Range(0, 360),
        swingLimitZ: new Range(0, 360),
        twistLimitY: new Range(0, 360),
        twistLimitZ: new Range(0, 360)
    }
)
