import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import Choices from "./utils/Choices"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"

export type D6Motion = "locked" | "limited" | "free"

export default interface ID6Joint extends IJointBase {
    slideX: Nullable<D6Motion>
    slideY: Nullable<D6Motion>
    slideZ: Nullable<D6Motion>
    twistX: Nullable<D6Motion>
    swingY: Nullable<D6Motion>
    swingZ: Nullable<D6Motion>
    twistLimitY: Nullable<number>
    twistLimitZ: Nullable<number>
    swingLimitY: Nullable<number>
    swingLimitZ: Nullable<number>
}

export const d6JointSchema: Required<ExtractProps<ID6Joint>> = {
    ...jointBaseSchema,
    slideX: String,
    slideY: String,
    slideZ: String,
    twistX: String,
    swingY: String,
    swingZ: String,
    twistLimitY: Number,
    twistLimitZ: Number,
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
        slideX: new NullableDefault("locked"),
        slideY: new NullableDefault("locked"),
        slideZ: new NullableDefault("locked"),
        twistX: new NullableDefault("locked"),
        swingY: new NullableDefault("locked"),
        swingZ: new NullableDefault("locked"),
        twistLimitY: new NullableDefault(0),
        twistLimitZ: new NullableDefault(0),
        swingLimitY: new NullableDefault(0),
        swingLimitZ: new NullableDefault(0)
    },
    {
        slideX: motionChoices,
        slideY: motionChoices,
        slideZ: motionChoices,
        twistX: motionChoices,
        swingY: motionChoices,
        swingZ: motionChoices
    }
)
