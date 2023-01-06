import IPrimitive, { primitiveDefaults, primitiveSchema } from "./IPrimitive"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"

export default interface ITorus extends IPrimitive {
    segments: number
    radialSegmets: number
    theta: number
}

export const torusSchema: Required<ExtractProps<ITorus>> = {
    ...primitiveSchema,
    segments: Number,
    radialSegmets: Number,
    theta: Number
}

export const torusDefaults = extendDefaults<ITorus>(
    [primitiveDefaults],
    { segments: 32, radialSegmets: 16, theta: 360 },
    {
        segments: new Range(3, 32, 1),
        radialSegmets: new Range(2, 16, 1),
        theta: new Range(0, 360, 1)
    }
)
