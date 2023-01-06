import IPrimitive, { primitiveDefaults, primitiveSchema } from "./IPrimitive"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"

export default interface ICone extends IPrimitive {
    segments: number
}

export const coneSchema: Required<ExtractProps<ICone>> = {
    ...primitiveSchema,
    segments: Number
}

export const coneDefaults = extendDefaults<ICone>(
    [primitiveDefaults],
    { segments: 32 },
    { segments: new Range(3, 32, 1) }
)
