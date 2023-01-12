import ILoaded, { loadedDefaults, loadedSchema } from "./ILoaded"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"
import Range from "./utils/Range"

export default interface IModel extends ILoaded {
    resize: boolean
    metalnessFactor: Nullable<number>
    roughnessFactor: Nullable<number>
    opacityFactor: Nullable<number>
    envFactor: Nullable<number>
    reflection: Nullable<boolean>
    illumination: Nullable<boolean>
}

export const modelSchema: Required<ExtractProps<IModel>> = {
    ...loadedSchema,
    resize: Boolean,
    metalnessFactor: Number,
    roughnessFactor: Number,
    opacityFactor: Number,
    envFactor: Number,
    reflection: Boolean,
    illumination: Boolean
}

export const modelDefaults = extendDefaults<IModel>(
    [loadedDefaults],
    {
        resize: true,
        metalnessFactor: new NullableDefault(1),
        roughnessFactor: new NullableDefault(1),
        opacityFactor: new NullableDefault(1),
        envFactor: new NullableDefault(1),
        reflection: new NullableDefault(false),
        illumination: new NullableDefault(false)
    },
    {
        metalnessFactor: new Range(-2, 2),
        roughnessFactor: new Range(0, 4),
        opacityFactor: new Range(0, 4),
        envFactor: new Range(0, 4)
    }
)
