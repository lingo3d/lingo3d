import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"
import Range from "./utils/Range"

export default interface IAdjustMaterial {
    metalnessFactor: Nullable<number>
    roughnessFactor: Nullable<number>
    opacityFactor: Nullable<number>
    envFactor: Nullable<number>
    reflection: boolean
}

export const adjustMaterialSchema: Required<ExtractProps<IAdjustMaterial>> = {
    metalnessFactor: Number,
    roughnessFactor: Number,
    opacityFactor: Number,
    envFactor: Number,
    reflection: Boolean
}

export const adjustMaterialDefaults = extendDefaults<IAdjustMaterial>(
    [],
    {
        metalnessFactor: new NullableDefault(0),
        roughnessFactor: new NullableDefault(1),
        opacityFactor: new NullableDefault(1),
        envFactor: new NullableDefault(1),
        reflection: false
    },
    {
        metalnessFactor: new Range(-2, 2),
        roughnessFactor: new Range(0, 4),
        opacityFactor: new Range(0, 4),
        envFactor: new Range(0, 4)
    }
)
