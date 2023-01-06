import IPrimitive, { primitiveDefaults, primitiveSchema } from "./IPrimitive"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"

export default interface ITorus extends IPrimitive {
    segments: number
    thickness: number
    theta: number
}

export const torusSchema: Required<ExtractProps<ITorus>> = {
    ...primitiveSchema,
    segments: Number,
    thickness: Number,
    theta: Number
}

export const torusDefaults = extendDefaults<ITorus>(
    [primitiveDefaults],
    { segments: 32, thickness: 0.1, theta: 360 },
    {
        segments: new Range(3, 32, 1),
        thickness: new Range(0.01, 1),
        theta: new Range(0, 360, 1)
    }
)
