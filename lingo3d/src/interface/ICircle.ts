import IPrimitive, { primitiveDefaults, primitiveSchema } from "./IPrimitive"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"

export default interface ICircle extends IPrimitive {
    theta: number
    segments: number
}

export const circleSchema: Required<ExtractProps<ICircle>> = {
    ...primitiveSchema,
    theta: Number,
    segments: Number
}

export const circleDefaults = extendDefaults<ICircle>(
    [primitiveDefaults],
    { scaleZ: 0, depth: 0, theta: 360, segments: 32 },
    { theta: new Range(0, 360, 1), segments: new Range(3, 32, 1) }
)
