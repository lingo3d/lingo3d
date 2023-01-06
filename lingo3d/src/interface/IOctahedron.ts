import IPrimitive, { primitiveDefaults, primitiveSchema } from "./IPrimitive"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"

export default interface IOctahedron extends IPrimitive {
    detail: number
}

export const octahedronSchema: Required<ExtractProps<IOctahedron>> = {
    ...primitiveSchema,
    detail: Number
}

export const octahedronDefaults = extendDefaults<IOctahedron>(
    [primitiveDefaults],
    { detail: 0 },
    { detail: new Range(0, 5, 1) }
)
