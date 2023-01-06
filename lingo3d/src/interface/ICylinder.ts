import IPrimitive, { primitiveDefaults, primitiveSchema } from "./IPrimitive"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"

export default interface ICylinder extends IPrimitive {
    segments: number
    radiusTop: number
    radiusBottom: number
}

export const cylinderSchema: Required<ExtractProps<ICylinder>> = {
    ...primitiveSchema,
    segments: Number,
    radiusTop: Number,
    radiusBottom: Number
}

export const cylinderDefaults = extendDefaults<ICylinder>(
    [primitiveDefaults],
    { segments: 32, radiusTop: 0.5, radiusBottom: 0.5 },
    {
        segments: new Range(3, 32, 1),
        radiusTop: new Range(0, 2),
        radiusBottom: new Range(0, 2)
    }
)
