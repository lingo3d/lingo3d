import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import Choices from "./utils/Choices"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"

export type D6Motion = "eLOCKED" | "eLIMITED" | "eFREE"

export default interface ID6Joint extends IJointBase {
    distanceLimit: Nullable<number>
    eX: Nullable<D6Motion>
    // eY: Nullable<D6Motion>
    // eZ: Nullable<D6Motion>
    // eSWING1: Nullable<D6Motion>
    // eSWING2: Nullable<D6Motion>
    // eTWIST: Nullable<D6Motion>
    // eCOUNT: Nullable<D6Motion>
}

export const d6JointSchema: Required<ExtractProps<ID6Joint>> = {
    ...jointBaseSchema,
    distanceLimit: Number,
    eX: String
    // eY: String,
    // eZ: String,
    // eSWING1: String,
    // eSWING2: String,
    // eTWIST: String,
    // eCOUNT: String
}

const motionChoices = new Choices({
    eLOCKED: "eLOCKED",
    eLIMITED: "eLIMITED",
    eFREE: "eFREE"
})
export const d6JointDefaults = extendDefaults<ID6Joint>(
    [jointBaseDefaults],
    {
        distanceLimit: new NullableDefault(0),
        eX: new NullableDefault("eLOCKED")
        // eY: new NullableDefault("eFREE"),
        // eZ: new NullableDefault("eFREE"),
        // eSWING1: new NullableDefault("eFREE"),
        // eSWING2: new NullableDefault("eFREE"),
        // eTWIST: new NullableDefault("eFREE"),
        // eCOUNT: new NullableDefault("eFREE")
    },
    {
        eX: motionChoices
    }
)
