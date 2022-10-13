import { extendDefaults } from "./utils/Defaults"
import defaultsOptionsMap from "./utils/defaultsOptionsMap"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"
import Options from "./utils/Options"
import Range from "./utils/Range"

export default interface IAdjustMaterial {
    metalnessFactor: Nullable<number>
    roughnessFactor: Nullable<number>
    opacityFactor: Nullable<number>
    envFactor: Nullable<number>
    adjustColor: Nullable<string>
    reflection: boolean
}

export const adjustMaterialSchema: Required<ExtractProps<IAdjustMaterial>> = {
    metalnessFactor: Number,
    roughnessFactor: Number,
    opacityFactor: Number,
    envFactor: Number,
    adjustColor: String,
    reflection: Boolean
}

export const adjustMaterialDefaults = extendDefaults<IAdjustMaterial>([
    {
        metalnessFactor: new NullableDefault(0),
        roughnessFactor: new NullableDefault(1),
        opacityFactor: new NullableDefault(1),
        envFactor: new NullableDefault(1),
        adjustColor: new NullableDefault("#ffffff"),
        reflection: false
    }
])

defaultsOptionsMap.set(adjustMaterialDefaults, <Options<IAdjustMaterial>>{
    metalnessFactor: new Range(-2, 2),
    roughnessFactor: new Range(0, 4),
    opacityFactor: new Range(0, 4),
    envFactor: new Range(0, 4)
})
